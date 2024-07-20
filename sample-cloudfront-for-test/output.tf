output "s3-bucket-name" {
  value = aws_s3_bucket.bucket-for-hosting.bucket
}

output "cloudfront-distribution-id" {
  value = aws_cloudfront_distribution.cdn-for-frontend.id
}

output "cloudfront-distribution-url" {
  value = "https://${aws_cloudfront_distribution.cdn-for-frontend.domain_name}"
}
