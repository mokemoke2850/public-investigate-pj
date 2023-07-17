import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class CognitoStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.userPool = new cognito.UserPool(this, 'cognito-user-pool', {
      userPoolName: 'investigate-cognito-user-pool',
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.userPoolClient = new cognito.UserPoolClient(
      this,
      'cognito-user-pool-client',
      {
        userPool: this.userPool,
        authFlows: {
          adminUserPassword: true,
          custom: true,
          userSrp: true,
        },
        supportedIdentityProviders: [
          cognito.UserPoolClientIdentityProvider.COGNITO,
        ],
      }
    );

    new cognito.CfnUserPoolGroup(this, 'cognito-admin-group', {
      userPoolId: this.userPool.userPoolId,
      groupName: 'admin',
    });

    new cognito.CfnUserPoolGroup(this, 'cognito-member-group', {
      userPoolId: this.userPool.userPoolId,
      groupName: 'member',
    });
  }
}
