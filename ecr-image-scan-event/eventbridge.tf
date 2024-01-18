resource "aws_cloudwatch_event_rule" "ecr-image-scan" {
  name          = "ecr-image-scan"
  description   = "Triggers when an ECR image scan is completed for a specific repository"
  event_pattern = jsonencode(local.basicscan_event_pattern)
}

resource "aws_cloudwatch_event_target" "ecr-image-scan-event-target" {
  rule      = aws_cloudwatch_event_rule.ecr-image-scan.name
  target_id = "SendEmail"
  arn       = aws_sns_topic.ecr-image-scan-topic.arn
}
