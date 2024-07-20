resource "aws_s3_bucket" "bucket-for-hosting" {
  bucket = var.bucket_name
  tags = {
    Dept = var.dept
  }
}

data "aws_iam_policy_document" "policy-for-s3" {
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
      values   = [aws_cloudfront_distribution.cdn-for-frontend.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "allow-cloudfront-access" {
  bucket = aws_s3_bucket.bucket-for-hosting.bucket
  policy = data.aws_iam_policy_document.policy-for-s3.json
}
