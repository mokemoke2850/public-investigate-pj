#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsStack } from '../lib/aws-stack';
import { LambdaEdgeStack } from '../lib/stack/LambdaEdgeStack';

const app = new cdk.App();
const appStack = new AwsStack(app, 'AwsStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */
  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  env: { region: 'ap-northeast-1' },
  crossRegionReferences: true,
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});

const lambdaStack = new LambdaEdgeStack(app, 'LambdaStack', {
  stackProps: {
    env: {
      region: 'us-east-1',
    },
    crossRegionReferences: true,
  },
});
