import {
  AdminResetUserPasswordCommand,
  AdminResetUserPasswordCommandInput,
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const VALID_PERIOD = process.env.VALID_PERIOD || '90';
const AWS_REGION = process.env.AWS_REGION || 'ap-northeast-1';
const USER_POOL_ID = process.env.USER_POOL_ID || '';

async function handler(event: any) {
  const VALID_PERIOD_NUM = Number(VALID_PERIOD);
  if (USER_POOL_ID === '') {
    throw new Error('USER_POOL_ID is not set');
  }

  if (isNaN(VALID_PERIOD_NUM)) {
    throw new Error('VALID_PERIOD is not number');
  }

  const client = new CognitoIdentityProviderClient({
    region: AWS_REGION,
  });

  const listUsersCommand = new ListUsersCommand({
    UserPoolId: USER_POOL_ID,
    Filter: 'status = "Enabled"',
  });

  const users = (await client.send(listUsersCommand)).Users ?? [];
  const now = new Date();

  const targetUserNames = users
    .filter((user) => {
      if (!user.UserLastModifiedDate) {
        return false;
      }
      const lastModifiedDate = new Date(user.UserLastModifiedDate);
      return isOlderThanDays(lastModifiedDate, now, VALID_PERIOD_NUM);
    })
    .map((user) => user.Username);

  if (targetUserNames.length === 0) {
    console.log('no changed password status users');
    return;
  }

  const params: AdminResetUserPasswordCommandInput[] = targetUserNames.map(
    (userName) => ({
      UserPoolId: USER_POOL_ID,
      Username: userName,
    })
  );

  const updateCommands = params.map(
    (param) => new AdminResetUserPasswordCommand(param)
  );

  const results = await Promise.allSettled(
    updateCommands.map((command) => client.send(command))
  );
  const successCount = results.filter(
    (result) =>
      result.status === 'fulfilled' &&
      result.value.$metadata.httpStatusCode === 200
  ).length;

  console.log(`updated ${successCount} users`);
}

const isOlderThanDays = (date: Date, now: Date, days: number) => {
  const diff = now.getTime() - date.getTime();
  return diff > 1000 * 60 * 60 * 24 * days;
};

handler({});
