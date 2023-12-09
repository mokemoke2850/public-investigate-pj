variable "resource_name_prefix" {
  description = "Prefix for all resources"
  type        = string
  default     = ""
}

variable "app_japanese_name" {
  description = "value of app_japanese_name"
  type        = string
  default     = "テストアプリ"
}

variable "cognito_user_group_name" {
  description = "value of cognito_user_group_name"
  type        = list(string)
  default     = ["一般ユーザ", "管理者"]
}
