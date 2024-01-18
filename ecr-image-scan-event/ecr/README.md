This terraform code in ecr directory is for testing this project.

When you use in your project, you should create ecr repositories with management console, aws cli or another IaC code.

## How to use

1. Crate a ECR repository.
   When complete creating, you can get build and push commands from management console.

```bash
terraform init && terraform apply
```

2. Build docker image and push to ECR repository, Using commands show step 1.

```bash
# example
# you can get commands like below after creating ECR repository.
# execute these commands in order from to bottom.
_1_login_command = "aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin ************9.dkr.ecr.ap-northeast-1.amazonaws.com/test-ecr-repository"
_2_build_command = "docker build -t ************9.dkr.ecr.ap-northeast-1.amazonaws.com/test-ecr-repository:latest ."
_3_tag_command = "docker tag ************9.dkr.ecr.ap-northeast-1.amazonaws.com/test-ecr-repository:latest ************9.dkr.ecr.ap-northeast-1.amazonaws.com/test-ecr-repository:latest"
_4_push_command = "docker push ************.dkr.ecr.ap-northeast-1.amazonaws.com/test-ecr-repository:latest"
```
