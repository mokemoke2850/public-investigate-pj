resource "aws_cognito_user_pool" "test-user-pool" {
  name                = "test-user-pool-for-changing-passord"
  deletion_protection = var.user_pool_protected ? "ACTIVE" : "INACTIVE"

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
    minimum_length                   = 10
    require_lowercase                = true
    require_numbers                  = true
    require_symbols                  = true
    require_uppercase                = true
    temporary_password_validity_days = 7
  }

  admin_create_user_config {
    allow_admin_create_user_only = true
    invite_message_template {
      email_subject = "テスト認証用パスワード"
      email_message = "{username}さんの初回パスワードです。{####}でログインしてください。"
      # Evne if using only TOTP, it is requred
      sms_message = "{username}さんの初回パスワードです。{####}でログインしてください。"
    }
  }
}
