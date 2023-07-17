import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsp from 'aws-cdk-lib/aws-ecs-patterns';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

interface ECSStackProps {
  vpc: cdk.aws_ec2.Vpc;
  alb: cdk.aws_elasticloadbalancingv2.ApplicationLoadBalancer;
  backendRepository: cdk.aws_ecr.IRepository;
  userPoolID: string;
  stackProps?: cdk.StackProps;
}

export class ECSStack extends cdk.Stack {
  public readonly ecsService: ecsp.ApplicationLoadBalancedFargateService;

  constructor(scope: cdk.Stack, id: string, props: ECSStackProps) {
    const { vpc, alb, backendRepository, userPoolID, stackProps } = props;
    super(scope, id, stackProps);

    const ecsCluster = new ecs.Cluster(this, 'backend-api-ecs-cluster', {
      clusterName: 'investigate-cognito-ecs-cluster',
      vpc: vpc,
    });

    const taskDefinition = new ecs.FargateTaskDefinition(
      scope,
      'backend-api-fargate-task',
      {
        cpu: 256,
        memoryLimitMiB: 512,
      }
    );

    taskDefinition.addContainer('backend-api-container', {
      containerName: 'backend-api',
      image: ecs.ContainerImage.fromEcrRepository(backendRepository, 'latest'),
      portMappings: [{ containerPort: 80, hostPort: 80 }],
      environment: {
        API_ENV: 'production',
        API_PORT: '80',
        AWS_REGION: 'ap-northeast-1',
        USER_POOL_ID: userPoolID,
      },
      logging: ecs.LogDriver.awsLogs({
        streamPrefix: 'investigate-cognito',
      }),
    });

    this.ecsService = new ecsp.ApplicationLoadBalancedFargateService(
      scope,
      'ecsp-alb-fargate',
      {
        cluster: ecsCluster,
        taskDefinition: taskDefinition,
        serviceName: 'investigate-cognito-service',
        loadBalancer: alb,
        desiredCount: 1,
        taskSubnets: vpc.selectSubnets({
          subnetType: cdk.aws_ec2.SubnetType.PRIVATE_WITH_EGRESS,
        }),
        openListener: false,
        enableExecuteCommand: true,
      }
    );

    // change health check path to /ishealty
    this.ecsService.targetGroup.configureHealthCheck({
      path: '/ishealthy',
      port: '80',
      protocol: elbv2.Protocol.HTTP,
    });
  }
}
