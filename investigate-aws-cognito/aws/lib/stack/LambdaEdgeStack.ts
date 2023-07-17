import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';
import * as path from 'node:path';

interface LambdaEdgeStackProps {
  stackProps?: cdk.StackProps;
}

export class LambdaEdgeStack extends cdk.Stack {
  public readonly jwtAuthLambda: cloudfront.experimental.EdgeFunction;
  constructor(scope: Construct, id: string, props: LambdaEdgeStackProps) {
    super(scope, id, props.stackProps);

    this.jwtAuthLambda = new cloudfront.experimental.EdgeFunction(
      this,
      'cf-lambda',
      {
        code: lambda.Code.fromAsset(
          path.join(__dirname, '../lambda/cognito-auth-lambda')
        ),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
      }
    );
  }
}
