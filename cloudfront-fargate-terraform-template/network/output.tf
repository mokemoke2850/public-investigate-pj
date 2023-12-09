output "vpc_id" {
  value = aws_vpc.vpc.id
}

output "public_1a_id" {
  value = aws_subnet.public-1a.id
}

output "public_1c_id" {
  value = aws_subnet.public-1c.id
}

output "private_1a_id" {
  value = aws_subnet.private-1a.id
}

output "private_1c_id" {
  value = aws_subnet.private-1c.id
}
