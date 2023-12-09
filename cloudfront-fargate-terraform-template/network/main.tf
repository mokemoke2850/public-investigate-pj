terraform {
  required_version = "~> 1.6.5"
  # # When deploying to production, you can use the following configuration.
  #   backend "s3" {
  #     bucket  = "terraform-remote-state-bucket"
  #     key     = "network/terraform.tfstate"
  #     region  = "ap-northeast-1"
  #     encrypt = true
  #   }
}

provider "aws" {
  region = "ap-northeast-1"
}
