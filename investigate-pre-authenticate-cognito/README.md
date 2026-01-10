# Cognito-Pre-Authentication

## 概要
AWS Cognitoにパスワード有効期限を90日に設定するためのサンプルプロジェクトです。

認証時にカスタム属性の`password_last_changed`を確認し、90日を超えている場合はログインを失敗させて、パスワード変更を促し、パスワード変更画面にリダイレクトします。

パスワード変更成功時には、`password_last_changed`属性を現在日時に更新します。

## 構成
- frontend: Reactを使用したフロントエンドアプリケーション（サンプル）
- backend: AWS Lambdaを使用したバックエンド処理（本体）

## 使い方
0. backendディレクトリで`npm install`を実行して依存関係をインストールし、`npm run build`でLambda関数のビルドを行います。
1. AWS Cognitoのユーザプールを作成します。（手順は一般方法で良いので割愛します）
2. ユーザプールにカスタム属性`password_last_changed`を追加します。
3. distフォルダ内の`post-confirmation-trigger.js`コードをコピペしてLambda関数を作成し、Lambda関数のIAMロールに`backend/iam-policy/adding-lambda-inline-policy.json`の内容をインラインポリシーとして追加します。 
5. distフォルダ内の`pre-authentication-trigger.js`コードをコピペしてLambda関数を作成します。
6. distフォルダ内の`post-authentication-trigger.js`コードをコピペしてLambda関数を作成し、Lambda関数のIAMロールに`backend/iam-policy/adding-lambda-inline-policy.json`の内容をインラインポリシーとして追加します。 
7. ユーザプールの「拡張機能」設定で、
   - 「確認後Lambdaトリガー」に3.で作成したLambda関数を設定します。
   - 「認証前Lambdaトリガー」に4.で作成したLambda関数を設定します。
   - 「認証後Lambdaトリガー」に5.で作成したLambda関数を設定します。