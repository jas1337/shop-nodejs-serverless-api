import type { AWS } from "@serverless/typescript";
import { basicAuthorizer } from "@functions/index";
import { BASIC_AUTHORIZER_LAMBDA_ARN_EXPORT_NAME } from "../shared/constants";
import * as dotenv from "dotenv";

dotenv.config();

const serverlessConfiguration: AWS = {
  service: "authorization-service",
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-dotenv-plugin",
    "serverless-offline",
    "serverless-auto-swagger",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "eu-west-1",
    stage: '${opt:stage, "dev"}',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      AUTH_USER: "${env:AUTH_USER}",
      AUTH_PASSWORD: "${env:AUTH_PASSWORD}",
    },
  },
  // import the function via paths
  functions: { basicAuthorizer },
  package: { individually: true },
  resources: {
    Outputs: {
      basicAuthorizerArn: {
        Value: { "Fn::GetAtt": ["BasicAuthorizerLambdaFunction", "Arn"] },
        Export: {
          Name: BASIC_AUTHORIZER_LAMBDA_ARN_EXPORT_NAME,
        },
      },
    },
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    autoswagger: {
      title: "Authorization service API",
      apiType: "http",
      basePath: "/${sls:stage}",
      typefiles: ["./src/types/api-types.d.ts"],
    },
  },
};

module.exports = serverlessConfiguration;
