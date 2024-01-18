terraform {
  required_version = "~> 1.6.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.32.1"
    }
  }
}

provider "aws" {
  region = "ap-northeast-1"
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}


resource "aws_ecr_repository" "test-ecr-repository" {
  name                 = "test-ecr-repository"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }
  force_delete = true
}

output "_1_login_command" {
  value = "aws ecr get-login-password --region ${data.aws_region.current.name} | docker login --username AWS --password-stdin ${aws_ecr_repository.test-ecr-repository.repository_url}"
}

output "_2_build_command" {
  value = "docker build -t ${aws_ecr_repository.test-ecr-repository.repository_url}:latest ."
}

output "_3_tag_command" {
  value = "docker tag ${aws_ecr_repository.test-ecr-repository.repository_url}:latest ${aws_ecr_repository.test-ecr-repository.repository_url}:latest"
}

output "_4_push_command" {
  value = "docker push ${aws_ecr_repository.test-ecr-repository.repository_url}:latest"
}


