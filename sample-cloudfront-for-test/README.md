# 使い方

## 前提

- Terraform がインストールされている
- AWS CLI がインストールされている
- AWS CLI のクレデンシャル設定が完了している

## クレデンシャルを設定する

`main.tf` の `provider "aws"` にアクセスキーとシークレットキー、プロファイル名を設定してください。

```hcl
provider "aws" {
  region = "ap-northeast-1"
  access_key = "********"
  secret_key = "*******"
  profile = "*******"
}
```

## リソースを作成する

`terraform.tfvars` バケット名とコスト管理用のタグの値を設定してください。

```bash
terraform init
terraform apply
```

## リソースを削除する

terraform のステートファイルはローカルに保存しているので、以下のコマンドでリソース削除できるのは、`terraform apply` で作成した作成者のみです。

それ以外の人はマネジメントコンソールから削除していください。

本番環境等で複数人が terraform コードから編集したい場合は、ステートファイルの保存場所を S3 などに保存して、共有するようにしてください。

また、S3 バケットにファイルが保存されている場合は、バケットの削除に失敗します。

```bash
terraform destroy
```
