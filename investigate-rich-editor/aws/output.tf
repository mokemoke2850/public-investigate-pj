output "genarated_access_key_id" {
  value = aws_iam_access_key.iam_access_key.id
}

output "genarated_secret_access_key_id" {
  value     = aws_iam_access_key.iam_access_key.secret
  sensitive = true
}
