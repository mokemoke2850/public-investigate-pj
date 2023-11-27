provider "aws" {
  region = "ap-northeast-1"
}

// S3 Bucket
resource "aws_s3_bucket" "test_bucket_for_uploading_and_downloading" {
  bucket        = var.aws_s3_bucket_name
  force_destroy = true # When using production, you should set this to false
}

// IAM Policy
resource "aws_iam_policy" "enable_s3_bucket_policy" {
  name        = "enable_put_and_get_s3_for_${aws_s3_bucket.test_bucket_for_uploading_and_downloading.bucket}"
  description = "Enable put and get s3 for ${aws_s3_bucket.test_bucket_for_uploading_and_downloading.bucket}"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::${aws_s3_bucket.test_bucket_for_uploading_and_downloading.bucket}/*",
          "arn:aws:s3:::${aws_s3_bucket.test_bucket_for_uploading_and_downloading.bucket}"
        ]
      }
    ]
  })
}

// IAM User
resource "aws_iam_user" "test_user_for_uploading_and_downloading" {
  name          = "test_user_for_uploading_and_downloading_to_s3"
  force_destroy = true # When using production, you should set this to false
}

resource "aws_iam_user_policy_attachment" "user_policy_attachment" {
  user       = aws_iam_user.test_user_for_uploading_and_downloading.name
  policy_arn = aws_iam_policy.enable_s3_bucket_policy.arn
}

// IAM Access Key
resource "aws_iam_access_key" "iam_access_key" {
  user    = aws_iam_user.test_user_for_uploading_and_downloading.name
  pgp_key = var.gpg_public_key
}
