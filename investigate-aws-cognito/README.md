# investigate-cognito

## OverView

This project was created by investigating how to use cogito and create authorization logic with React and WebAPI with ECS.

## Memo

### Settings are automatically adding the ingress rule to ALB Security Group rules.

When creating an ECS (Elastic Container Service) and ALB (Application Load Balancer) using `ApplicationLoadBalancedFargateService`, the ingress rule of the security group applied to the ALB is added with an IPv4 rule anywhere.

If you want to restrict access to the ALB only from CloudFront, you need to add the following option:

```ts
new ecsp.ApplicationLoadBalancedFargateService(
  scope,
  'sample-ecsp-alb-fargate-pattern',
  {
    openListener: false,
  }
);
```

### Post: "https://cognito-idp.ap-northeast-1.amazonaws.com/": x509: certificate signed by unknown authority"

When WebAPI of backend request key to cognito, the following error occurs.

`"https://cognito-idp.ap-northeast-1.amazonaws.com/": x509: certificate signed by unknown authority"`

The error occurs because debian-slim doesn't have root certificate.

You need install ca-certificate in Dockerfile like below.

```docker
RUN apt update && apt install -y ca-certificates
```

### Lambda@Edge doesn't support environment value

With AWS CDK, Lambda@Edge is created using `cloudfront.experimental.EdgeFunction`.

This class have an "environment" property although Lambda@Edge does not support environment variables.

If you set an environment value when configuring Lambda@Edge for CloudFront, an error will occur.

In this Project, the lambda function reads .env file using dotenv to set the values.

The .env file is manually updated.

```js
// lambda function
import * as dotenv from 'dotenv';
dotenv.config();

const USER_POOL_ID = process.env.USER_POOL_ID;
const CLIENT_ID = process.env.CLIENT_ID;
```

```env
# this file is manually updated after deploying aws resources
USER_POOL_ID=******
CLIENT_ID=******
```
