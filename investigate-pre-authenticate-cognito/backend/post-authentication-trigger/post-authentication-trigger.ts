import { PostAuthenticationTriggerHandler } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({});

export const handler: PostAuthenticationTriggerHandler = async (event) => {
  const { userPoolId, userName } = event;
  const { userAttributes } = event.request;
  const now = new Date().toISOString();

  // 判定ロジック：
  // custom:last_password_change がまだ存在しない場合のみ実行する。
  // これにより、初回ログイン（強制パスワード変更直後）のタイミングをキャッチでき、
  // かつ、2回目以降の通常のログインで有効期限が延長されるのを防げます。
  if (!userAttributes['custom:last_password_change']) {
    try {
      console.log(`Initializing password change date for user: ${userName}`);

      const command = new AdminUpdateUserAttributesCommand({
        UserPoolId: userPoolId,
        Username: userName,
        UserAttributes: [
          {
            Name: 'custom:last_password_change',
            Value: now,
          },
        ],
      });

      await client.send(command);
    } catch (error) {
      // ログイン自体は成功しているので、属性更新の失敗でユーザーをブロックしないよう例外はログ出力のみにする
      console.error('Error setting initial password change date:', error);
    }
  }

  return event;
};
