data "aws_ecr_repository" "scan_target_repository" {
  for_each = toset(var.ecr_repository_names)
  name     = each.value
}
