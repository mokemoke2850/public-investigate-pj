import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class VpcStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'cognito-vpc', {
      ipAddresses: ec2.IpAddresses.cidr('10.1.0.0/16'),
      availabilityZones: ['ap-northeast-1a', 'ap-northeast-1c'],
    });

    this.vpc.addGatewayEndpoint('s3-endpoint-from-private', {
      service: ec2.GatewayVpcEndpointAwsService.S3,
      subnets: [
        {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });
  }
}
