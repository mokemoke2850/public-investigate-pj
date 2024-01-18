resource "aws_iam_role" "ecr-scan-events-role" {
  name = "scan-ecr"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Principal = {
          Service = [
            "events.amazonaws.com",
            "scheduler.amazonaws.com",
          ]
        }
        Effect = "Allow"
      }
    ]
  })
}

resource "aws_iam_role_policy" "ecr-scan-events-policy" {
  name = "scan-ecr"
  role = aws_iam_role.ecr-scan-events-role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ecr:StartImageScan",
        ]
        Effect   = "Allow"
        Resource = [for repository in data.aws_ecr_repository.scan_target_repository : repository.arn]
      }
    ]
  })
}
