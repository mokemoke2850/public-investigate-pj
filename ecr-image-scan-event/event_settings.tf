locals {
  basicscan_event_pattern = {
    "source"      = ["aws.ecr"]
    "detail-type" = ["ECR Image Scan"]
    "detail" = {
      "scan-status"     = ["COMPLETE"]
      "repository-name" = [for repository in data.aws_ecr_repository.scan_target_repository : repository.name]
    }
  }
}

locals {
  basicscan_event_schedules = { for repository in data.aws_ecr_repository.scan_target_repository : repository.name => {
    name              = "${repository.name}-basicscan"
    ImageTag          = "latest"
    "repository-name" = repository.name
  } }
}

locals {
  scheduler_schedule_group_name = "ecr-image-scan"
}
