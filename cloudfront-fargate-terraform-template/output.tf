output "user_pool_id" {
  value = aws_cognito_user_pool.cognito-user-pool.id
}

output "user_pool_client_id" {
  value = aws_cognito_user_pool_client.cognito-user-pool-clinet.id
}

output "cloudfront_url" {
  value = aws_cloudfront_distribution.for-frontend.domain_name
}
