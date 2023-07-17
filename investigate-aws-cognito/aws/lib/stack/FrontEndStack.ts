import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CloudFrontStack } from './CloudFront';
import path = require('path');
import { CognitoStack } from './CognitoStack';

interface FrontEndStackProps {
  alb?: cdk.aws_elasticloadbalancingv2.ApplicationLoadBalancer;
  cognito?: CognitoStack;
  stackProps?: cdk.StackProps;
}

export class FrontEndStack extends cdk.Stack {
  public readonly userPoolId: string;
  constructor(scope: Construct, id: string, props: FrontEndStackProps) {
    const { alb, cognito, stackProps } = props;
    super(scope, id, stackProps);
    const cloudfront = new CloudFrontStack(this, 'cognito-cf', {
      alb: alb,
      stackProps: stackProps,
    });
    cloudfront.deployFrontEndFiles(
      path.join(__dirname, '../../../frontend/dist')
    );

    new cdk.CfnOutput(this, 'frontend-url', {
      value: cloudfront.url,
    });

    if (cognito) {
      new cdk.CfnOutput(this, 'user-pool-id', {
        value: cognito.userPool.userPoolId,
      });

      new cdk.CfnOutput(this, 'user-client-id', {
        value: cognito.userPoolClient.userPoolClientId,
      });
    }
  }
}
