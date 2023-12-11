terraform {
  required_version = "~>1.6.5"
  # # When deploying to production, you can use the following configuration.
  #   backend "s3" {
  #     bucket  = "terraform-remote-state-bucket"
  #     key     = "ecr/terraform.tfstate"
  #     region  = "ap-northeast-1"
  #     encrypt = true
  #   }
}

resource "aws_ecr_repository" "ecr-aws_ecr_repository" {
  name = "ecr-aws_ecr_repository"

  lifecycle {
    prevent_destroy = true
  }
}
