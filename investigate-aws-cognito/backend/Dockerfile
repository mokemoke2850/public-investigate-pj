FROM golang:1.20-bullseye as deploy-builder

WORKDIR /app

COPY ./go.mod ./go.sum ./
RUN go mod download

COPY . .
RUN go build -trimpath -ldflags "-w -s" -o app

FROM debian:bullseye-slim as deploy

RUN apt-get update && apt install -y ca-certificates

COPY --from=deploy-builder /app/app .

EXPOSE 50051

CMD ["./app"]