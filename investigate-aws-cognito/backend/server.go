package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/lestrrat-go/jwx/jwk"
)

func main() {
	e := echo.New()

	CORS_PERMIT := os.Getenv("BACKEND_URL")
	if CORS_PERMIT == "" {
		CORS_PERMIT = "localhost:8000"
	}

	API_ENV := os.Getenv("API_ENV")
	if API_ENV == "" {
		API_ENV = "local"
	}

	API_PORT := os.Getenv("API_PORT")
	if API_PORT == "" {
		API_PORT = "50051"
	}

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{CORS_PERMIT},
		AllowMethods: []string{"*"},
	}))

	registerRoute(e)

	fmt.Printf("launch %s mode\n", API_ENV)
	e.Logger.Fatal(e.Start(":" + API_PORT))
}

func registerRoute(e *echo.Echo) {

	e.GET("/ishealthy", func(c echo.Context) error {
		return c.String(http.StatusOK, "ishealty")
	})

	baseURL := e.Group("/api")

	baseURL.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "HelloWorld! from /api group")
	})

	baseURL.GET("/login", func(c echo.Context) error {
		return c.String(http.StatusOK, "HelloWorld! from /login.")
	})

	baseURL.GET("/api/", func(c echo.Context) error {
		return c.String(http.StatusOK, "HelloWorld! from /api")
	})

	config := middleware.JWTConfig{
		KeyFunc: getKey,
	}

	authGroup := baseURL.Group("/auth")
	authGroup.Use(middleware.JWTWithConfig(config))
	authGroup.GET("", func(c echo.Context) error {
		return c.String(http.StatusOK, "Succeed in auth!")
	})

}

func getKey(token *jwt.Token) (interface{}, error) {
	USER_POOL_ID := os.Getenv("USER_POOL_ID")

	AWS_REGION := os.Getenv("AWS_REGION")
	if AWS_REGION == "" {
		AWS_REGION = "ap-northeast-1"
	}

	keySet, err := jwk.Fetch(context.Background(), fmt.Sprintf("https://cognito-idp.%s.amazonaws.com/%s/.well-known/jwks.json", AWS_REGION, USER_POOL_ID))
	if err != nil {
		return nil, err
	}
	keyID, ok := token.Header["kid"].(string)
	if !ok {
		return nil, errors.New("expecting JWT header to have a key ID in the kid field")
	}
	key, found := keySet.LookupKeyID(keyID)
	if !found {
		return nil, fmt.Errorf("unable to find key %q", keyID)
	}
	var pubkey interface{}
	if err := key.Raw(&pubkey); err != nil {
		return nil, fmt.Errorf("Unable to get the public key. Error: %s", err.Error())
	}
	return pubkey, nil
}
