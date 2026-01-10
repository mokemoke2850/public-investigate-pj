import { PostConfirmationTriggerHandler } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({});

export const handler: PostConfirmationTriggerHandler = async (event) => {
  // パスワードリセット（ConfirmForgotPassword）が成功した時だけ実行
  if (event.triggerSource === 'PostConfirmation_ConfirmForgotPassword') {
    const { userPoolId, userName } = event;
    const now = new Date().toISOString();

    try {
      const command = new AdminUpdateUserAttributesCommand({
        UserPoolId: userPoolId,
        Username: userName,
        UserAttributes: [
          {
            Name: 'custom:last_password_change', // ここでパスワード更新日を上書き
            Value: now,
          },
        ],
      });
      await client.send(command);
    } catch (error) {
      console.error('Failed to update password change date:', error);
    }
  }

  return event;
};
