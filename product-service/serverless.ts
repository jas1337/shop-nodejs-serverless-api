import type { AWS } from "@serverless/typescript";
import {
  createProduct,
  getProductsList,
  getProductById,
} from "@functions/index";

const serverlessConfiguration: AWS = {
  service: "product-service",
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
    stage: "dev",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:*"],
        Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/*",
      },
    ],
  },
  // import the function via paths
  functions: {
    createProduct,
    getProductsList,
    getProductById,
  },
  package: { individually: true },
  // uncomment to create tables on AWS (one-time action)
  resources: {
    Resources: {
      productsTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "products",
          AttributeDefinitions: [
            { AttributeName: "id", AttributeType: "S" },
            { AttributeName: "title", AttributeType: "S" },
          ],
          KeySchema: [
            { AttributeName: "id", KeyType: "HASH" },
            { AttributeName: "title", KeyType: "RANGE" },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          Tags: [{ Key: "Name", Value: "cloudx_products" }],
        },
      },
      stocksTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "stocks",
          AttributeDefinitions: [
            { AttributeName: "product_id", AttributeType: "S" },
          ],
          KeySchema: [{ AttributeName: "product_id", KeyType: "HASH" }],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          Tags: [{ Key: "Name", Value: "cloudx_stocks" }],
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
      title: "Product service API",
      apiType: "http",
      basePath: "/dev",
      typefiles: [
        "./src/types/api-types.d.ts",
        "./src/types/product-with-count_interface.ts",
        "./src/types/product_interface.ts",
        "./src/types/stock_interface.ts",
      ],
    },
  },
};

module.exports = serverlessConfiguration;
