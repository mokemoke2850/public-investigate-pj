resource "aws_scheduler_schedule_group" "ecr-image-scan-schedule-group" {
  name = local.scheduler_schedule_group_name

  tags = {
    Name = local.scheduler_schedule_group_name
  }
}

resource "aws_scheduler_schedule" "ecr-image-scan-schedule" {
  for_each = local.basicscan_event_schedules

  description                  = "ベーシックスキャンを月1回実行"
  group_name                   = aws_scheduler_schedule_group.ecr-image-scan-schedule-group.name
  name                         = each.value.name
  schedule_expression          = "cron(0 0 1 * ? *)"
  schedule_expression_timezone = "Asia/Tokyo"
  state                        = "ENABLED"

  flexible_time_window {
    maximum_window_in_minutes = 15
    mode                      = "FLEXIBLE"
  }

  target {
    arn = "arn:aws:scheduler:::aws-sdk:ecr:startImageScan"
    input = jsonencode(
      {
        ImageId = {
          ImageTag = each.value.ImageTag
        }
        RepositoryName = each.value["repository-name"]
      }
    )
    role_arn = aws_iam_role.ecr-scan-events-role.arn

    retry_policy {
      maximum_event_age_in_seconds = 86400 //24h
      maximum_retry_attempts       = 5
    }
  }
}
