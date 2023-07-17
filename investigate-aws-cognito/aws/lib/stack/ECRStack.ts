import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';
import * as imageDeploy from 'cdk-docker-image-deployment';
import path = require('path');

export class ECRStack extends cdk.Stack {
  public readonly backendRepository: ecr.IRepository;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.backendRepository = new ecr.Repository(this, 'backend-repository', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      repositoryName: 'investigate-cognito-backend-repository',
    });

    // push the created image to the ecr repository
    new imageDeploy.DockerImageDeployment(this, 'backend-api-image-push', {
      source: imageDeploy.Source.directory(
        path.join(__dirname, '../../../', 'backend')
      ),
      destination: imageDeploy.Destination.ecr(this.backendRepository, {
        tag: 'latest',
      }),
    });
  }
}
