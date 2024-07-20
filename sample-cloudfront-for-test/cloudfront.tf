resource "aws_cloudfront_origin_access_control" "oac-for-frontend" {
  name                              = "${var.bucket_name}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

data "aws_cloudfront_cache_policy" "for-frontend" {
  name = "Managed-CachingOptimized"
}

resource "aws_cloudfront_function" "ip-white-list" {
  name    = "ip-restrict"
  comment = "allow access only for white list"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = file("./ip-restrict.js")
}

resource "aws_cloudfront_distribution" "cdn-for-frontend" {
  price_class         = "PriceClass_200" # アジア含む地域
  enabled             = true
  is_ipv6_enabled     = false
  default_root_object = "index.html"
  staging             = true # 本番環境ならfalseに設定する
  viewer_certificate {
    cloudfront_default_certificate = true
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  origin {
    domain_name              = aws_s3_bucket.bucket-for-hosting.bucket_regional_domain_name
    origin_id                = aws_s3_bucket.bucket-for-hosting.id
    origin_access_control_id = aws_cloudfront_origin_access_control.oac-for-frontend.id
  }


  # フロントエンドだけの想定なのでGET, HEAD, OPTIONSだけ許可
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = aws_s3_bucket.bucket-for-hosting.id
    cache_policy_id  = data.aws_cloudfront_cache_policy.for-frontend.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.ip-white-list.arn
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }


  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  tags = {
    Dept = var.dept
  }
}
