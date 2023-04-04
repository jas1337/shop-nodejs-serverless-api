import type { AWS } from "@serverless/typescript";

import { importFileParser, importProductsFile } from "@functions/index";
import {
  CATALOG_ITEMS_QUEUE_ARN_EXPORT_NAME,
  CATALOG_ITEMS_QUEUE_URL_EXPORT_NAME,
} from "../shared/constants";

const serverlessConfiguration: AWS = {
  service: "import-service",
  frameworkVersion: "3",
  plugins: [
    "serverless-auto-swagger",
    "serverless-esbuild",
    "serverless-offline",
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
      ENV_NAME: "${sls:stage}",
      BUCKET_NAME: "${self:custom.s3BucketName}",
      CATALOG_ITEMS_QUEUE_URL: {
        "Fn::ImportValue": CATALOG_ITEMS_QUEUE_URL_EXPORT_NAME,
      },
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "s3:ListBucket",
        Resource: "arn:aws:s3:::${self:custom.s3BucketName}",
      },
      {
        Effect: "Allow",
        Action: "s3:*",
        Resource: "arn:aws:s3:::${self:custom.s3BucketName}/*",
      },
      {
        Effect: "Allow",
        Action: "sqs:*",
        Resource: {
          "Fn::ImportValue": CATALOG_ITEMS_QUEUE_ARN_EXPORT_NAME,
        },
      },
    ],
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  resources: {
    Resources: {
      GatewayResponseUnauthorized: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.WWW-Authenticate": "'Basic'",
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Headers": "'*'",
          },
          RestApiId: {
            Ref: "ApiGatewayRestApi",
          },
          ResponseType: "UNAUTHORIZED",
          StatusCode: "401",
        },
      },
      GatewayResponseForbidden: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Headers": "'*'",
          },
          RestApiId: {
            Ref: "ApiGatewayRestApi",
          },
          ResponseType: "ACCESS_DENIED",
          StatusCode: "403",
        },
      },
      WebAppS3Bucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: "${self:custom.s3BucketName}",
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedHeaders: ["*"],
                AllowedMethods: ["PUT"],
                AllowedOrigins: ["*"],
              },
            ],
          },
        },
      },
    },
  },
  custom: {
    s3BucketName: "jas1337-import-service-bucket",
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
      title: "Import service API",
      apiType: "http",
      basePath: "/${sls:stage}",
      typefiles: ["./src/types/api-types.d.ts"],
    },
  },
};

module.exports = serverlessConfiguration;
