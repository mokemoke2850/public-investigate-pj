terraform {
  required_version = ">=5.3.0"
  # # When deploying to production, you can use the following configuration.
  #   backend "s3" {
  #     bucket  = "terraform-remote-state-bucket"
  #     key     = "path/to/my/terraform.tfstate"
  #     region  = "ap-northeast-1"
  #     encrypt = true
  #   }
}

provider "aws" {
  region = "ap-northeast-1"
}
