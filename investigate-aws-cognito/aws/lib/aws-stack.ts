import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { VpcStack } from './stack/VpcStack';
import { ALBStack } from './stack/ALBStack';
import { ECRStack } from './stack/ECRStack';
import { ECSStack } from './stack/ECSStack';
import { FrontEndStack } from './stack/FrontEndStack';
import { CognitoStack } from './stack/CognitoStack';

export class AwsStack extends cdk.Stack {
  public readonly USER_POOL_ID: string;
  public readonly CLIENT_ID: string;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new VpcStack(this, 'cognito-vpc-stack', props);

    const alb = new ALBStack(this, 'cognito-alb', {
      vpc: vpc.vpc,
      stackProps: props,
    });

    const cognito = new CognitoStack(this, 'frontend-cognito', props);
    this.USER_POOL_ID = cognito.userPool.userPoolId;
    this.CLIENT_ID = cognito.userPoolClient.userPoolClientId;

    const frontendParams = new FrontEndStack(this, 'cognito-frontend', {
      alb: alb.alb,
      cognito: cognito,
      stackProps: props,
    });

    const repository = new ECRStack(this, 'cognito-ecr', props);

    const ecs = new ECSStack(this, 'cognito-ecs', {
      vpc: vpc.vpc,
      alb: alb.alb,
      backendRepository: repository.backendRepository,
      userPoolID: cognito.userPool.userPoolId,
      stackProps: props,
    });

    new cdk.CfnOutput(this, 'alb-url', {
      value: `http://${alb.alb.loadBalancerDnsName}`,
    });

    new cdk.CfnOutput(this, 'task-def-arn', {
      value: `${ecs.ecsService.taskDefinition.taskDefinitionArn}`,
    });
  }
}
