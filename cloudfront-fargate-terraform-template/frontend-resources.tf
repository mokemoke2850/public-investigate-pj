resource "aws_cognito_user_pool" "cognito-user-pool" {
  name = "${var.resource_name_prefix}-user-pool"

  mfa_configuration = "ON"
  software_token_mfa_configuration {
    enabled = true
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  password_policy {
    minimum_length    = 10
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  admin_create_user_config {
    allow_admin_create_user_only = true
    invite_message_template {
      email_subject = "${var.app_japanese_name}ユーザ作成完了"
      email_message = "${var.app_japanese_name}のユーザが作成されました。\nユーザ名: {username}\nパスワード: {####}\n\nログイン後、パスワードを変更してください。"
      # Evne when you don't use SMS, you need to set SMS message template.
      sms_message = "Your username is {username} and temporary password is {####}."
    }
  }
}

resource "aws_cognito_user_group" "cognito-user-groups" {
  for_each     = toset(var.cognito_user_group_name)
  name         = each.value
  user_pool_id = aws_cognito_user_pool.cognito-user-pool.id
}

resource "aws_cognito_user_pool_client" "cognito-user-pool-clinet" {
  name         = "${var.resource_name_prefix}-user-pool-client"
  user_pool_id = aws_cognito_user_pool.cognito-user-pool.id
}
