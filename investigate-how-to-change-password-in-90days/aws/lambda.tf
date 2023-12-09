resource "aws_iam_role" "lambda-role" {
  name = "cognito-update-user-role-for-lambda"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

data "aws_iam_policy_document" "lambda-policy" {
  statement {
    actions = [
      "cognito-idp:AdminUpdateUserAttributes"
    ]
    effect = "Allow"
    resources = [
      aws_cognito_user_pool.test-user-pool.arn
    ]
  }

  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    effect = "Allow"
    resources = [
      "arn:aws:logs:*:*:*"
    ]
  }
}

resource "aws_iam_policy" "lambda-policy" {
  name   = "cognito-update-user-policy-for-lambda"
  policy = data.aws_iam_policy_document.lambda-policy.json

  depends_on = [
    aws_cognito_user_pool.test-user-pool
  ]
}

resource "aws_iam_role_policy_attachment" "lambda-policy-attachment" {
  role       = aws_iam_role.lambda-role.name
  policy_arn = aws_iam_policy.lambda-policy.arn
}

resource "aws_lambda_function" "change-cognito-password-status-lambda" {
  filename      = "lambda/change-cognito-password-status/dist.zip"
  function_name = "change-cognito-password-status"
  role          = aws_iam_role.lambda-role.arn
  runtime       = "nodejs20.x"
  handler       = "index.handler"

  environment {
    variables = {
      USER_POOL_ID = aws_cognito_user_pool.test-user-pool.id
      VALID_PERIOD = "90"
      REGION       = "ap-northeast-1"
    }
  }
}
