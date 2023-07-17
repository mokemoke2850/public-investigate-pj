import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3Deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

interface CloudFrontProps {
  alb?: elbv2.ApplicationLoadBalancer;
  stackProps?: cdk.StackProps;
}

export class CloudFrontStack extends cdk.Stack {
  public readonly cloudfront: cloudfront.CloudFrontWebDistribution;
  public readonly s3Bucket: s3.Bucket;
  public readonly oai: cloudfront.OriginAccessIdentity;
  public readonly url: string;

  constructor(scope: cdk.Stack, id: string, props: CloudFrontProps) {
    const { alb, stackProps } = props;
    super(scope, id, stackProps);

    this.s3Bucket = new s3.Bucket(this, 'frontend-s3-bucket', {
      bucketName: 'investigate-cognito-frontend-kldasjf',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    this.oai = new cloudfront.OriginAccessIdentity(
      this,
      'investigate-cognito-oai',
      {
        comment: `${this.s3Bucket.bucketName} access identity`,
      }
    );

    const bucketPolicyStatement = new iam.PolicyStatement({
      sid: `Get ${this.s3Bucket.bucketName} Object`,
      effect: iam.Effect.ALLOW,
      principals: [this.oai.grantPrincipal],
      actions: ['s3:GetObject'],
      resources: [`${this.s3Bucket.bucketArn}/*`],
    });
    this.s3Bucket.addToResourcePolicy(bucketPolicyStatement);

    const cloudfrontOrigins: cloudfront.SourceConfiguration[] = [
      {
        s3OriginSource: {
          s3BucketSource: this.s3Bucket,
          originAccessIdentity: this.oai,
        },
        behaviors: [
          {
            isDefaultBehavior: true,
            allowedMethods: cloudfront.CloudFrontAllowedMethods.GET_HEAD,
            cachedMethods: cloudfront.CloudFrontAllowedCachedMethods.GET_HEAD,
          },
        ],
      },
    ];

    if (alb) {
      cloudfrontOrigins.push({
        customOriginSource: {
          domainName: alb.loadBalancerDnsName,
          originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
        },
        behaviors: [
          {
            viewerProtocolPolicy:
              cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            pathPattern: 'api/*',
            forwardedValues: {
              queryString: true,
              headers: ['Authorization'],
              cookies: {
                forward: 'all',
              },
            },
          },
        ],
      });
    }

    this.cloudfront = new cloudfront.CloudFrontWebDistribution(
      this,
      'web-distribution',
      {
        enableIpV6: true,
        httpVersion: cloudfront.HttpVersion.HTTP2,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        originConfigs: cloudfrontOrigins,
        priceClass: cloudfront.PriceClass.PRICE_CLASS_200,
        errorConfigurations: [
          {
            errorCode: 403,
            responseCode: 200,
            errorCachingMinTtl: 0,
            responsePagePath: '/index.html',
          },
          {
            errorCode: 404,
            responseCode: 200,
            errorCachingMinTtl: 0,
            responsePagePath: '/index.html',
          },
        ],
      }
    );
    this.url = `https://${this.cloudfront.distributionDomainName}`;
  }

  public deployFrontEndFiles(filePath: string) {
    new s3Deploy.BucketDeployment(this, 'depoly-frontend', {
      sources: [s3Deploy.Source.asset(filePath)],
      destinationBucket: this.s3Bucket,
    });
  }
}
