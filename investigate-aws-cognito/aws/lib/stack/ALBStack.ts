import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elb2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

interface ALBStackProps {
  vpc: ec2.IVpc;
  stackProps?: cdk.StackProps;
}

export class ALBStack extends cdk.Stack {
  public readonly alb: elb2.ApplicationLoadBalancer;
  constructor(scope: cdk.Stack, id: string, props: ALBStackProps) {
    const { vpc, stackProps } = props;
    super(scope, id, stackProps);

    const albSecurityGroup = new ec2.SecurityGroup(
      scope,
      'http-from-cloudfront-security-group',
      {
        vpc,
        securityGroupName: 'ecs-alb-security-group',
      }
    );
    // managed prefix list of cloudfront
    albSecurityGroup.addIngressRule(
      ec2.Peer.prefixList('pl-58a04531'),
      ec2.Port.tcp(80)
    );
    albSecurityGroup.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic());

    this.alb = new elb2.ApplicationLoadBalancer(scope, 'ecs-alb', {
      vpc,
      internetFacing: true,
      vpcSubnets: vpc.selectSubnets({
        subnetType: ec2.SubnetType.PUBLIC,
      }),
      securityGroup: albSecurityGroup,
    });
    this.alb.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
  }
}
