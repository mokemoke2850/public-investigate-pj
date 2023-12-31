#region: Cognito
resource "aws_cognito_user_pool" "cognito-user-pool" {
  name = "${var.resource_name_prefix}-user-pool"

  mfa_configuration = "ON"
  software_token_mfa_configuration {
    enabled = true
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  password_policy {
    minimum_length    = 10
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  admin_create_user_config {
    allow_admin_create_user_only = true
    invite_message_template {
      email_subject = "${var.app_japanese_name}ユーザ作成完了"
      email_message = "${var.app_japanese_name}のユーザが作成されました。\nユーザ名: {username}\nパスワード: {####}\n\nログイン後、パスワードを変更してください。"
      # Evne when you don't use SMS, you need to set SMS message template.
      sms_message = "Your username is {username} and temporary password is {####}."
    }
  }
}

resource "aws_cognito_user_group" "cognito-user-groups" {
  for_each     = toset(var.cognito_user_group_name)
  name         = each.value
  user_pool_id = aws_cognito_user_pool.cognito-user-pool.id
}

resource "aws_cognito_user_pool_client" "cognito-user-pool-clinet" {
  name         = "${var.resource_name_prefix}-user-pool-client"
  user_pool_id = aws_cognito_user_pool.cognito-user-pool.id
}

#endregion: Cognito

#region: S3 bucket for hosting static web site

resource "aws_s3_bucket" "bucket-for-hosting" {
  bucket = "${var.resource_name_prefix}-frontend-bucket"
}

data "aws_iam_policy_document" "bucket-for-hosting-policy" {
  version = "2012-10-17"
  statement {
    sid    = "Allow CloudFront access to S3 bucket"
    effect = "Allow"
    actions = [
      "s3:GetObject",
    ]
    resources = [
      "${aws_s3_bucket.bucket-for-hosting.arn}/*",
    ]
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.for-frontend.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "allow-cloudfront-access" {
  bucket = aws_s3_bucket.bucket-for-hosting.id
  policy = data.aws_iam_policy_document.bucket-for-hosting-policy.json
}


#endregion: S3 bucket for hosting static web site

#region: CloudFront

data "aws_cloudfront_cache_policy" "for-frontend" {
  name = "Managed-CachingOptimized"
}

resource "aws_cloudfront_distribution" "for-frontend" {
  origin {
    domain_name              = aws_s3_bucket.bucket-for-hosting.bucket_domain_name
    origin_id                = aws_s3_bucket.bucket-for-hosting.id
    origin_access_control_id = aws_cloudfront_origin_access_control.for-frontend.id
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = aws_s3_bucket.bucket-for-hosting.id
    cache_policy_id  = data.aws_cloudfront_cache_policy.for-frontend.id


    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  # https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/PriceClass.html
  price_class = "PriceClass_100"

  custom_error_response {
    error_code            = "403"
    response_code         = "200"
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  tags = {
    Name = "${var.resource_name_prefix}-cloudfront"
  }
}

resource "aws_cloudfront_origin_access_control" "for-frontend" {
  name                              = "${var.resource_name_prefix}-cloudfront-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

#endregion: CloudFront


#TODO: Add WAF configuration

#TODO: Add ACM configuration
