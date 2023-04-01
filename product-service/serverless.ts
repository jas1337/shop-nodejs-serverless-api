import type { AWS } from "@serverless/typescript";
import {
  createProduct,
  getProductsList,
  getProductById,
  catalogBatchProcess,
} from "@functions/index";
import {
  CATALOG_ITEMS_QUEUE_ARN_EXPORT_NAME,
  CATALOG_ITEMS_QUEUE_URL_EXPORT_NAME,
} from "../shared/constants";

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
    stage: '${opt:stage, "dev"}',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000 ",
      ENV_NAME: "${sls:stage}",
      CREATE_PRODUCT_TOPIC_ARN: {
        Ref: "createProductTopic",
      },
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:*"],
        Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/*",
      },
      {
        Effect: "Allow",
        Action: ["sqs:*"],
        Resource: { "Fn::GetAtt": ["catalogItemsQueue", "Arn"] },
      },
      {
        Effect: "Allow",
        Action: ["sns:*"],
        Resource: { Ref: "createProductTopic" },
      },
    ],
  },
  // import the function via paths
  functions: {
    createProduct,
    getProductsList,
    getProductById,
    catalogBatchProcess,
  },
  package: { individually: true },
  resources: {
    Outputs: {
      catalogItemsQueueArn: {
        Value: { "Fn::GetAtt": ["catalogItemsQueue", "Arn"] },
        Export: {
          Name: CATALOG_ITEMS_QUEUE_ARN_EXPORT_NAME,
        },
      },
      catalogItemsQueueUrl: {
        Value: { Ref: "catalogItemsQueue" },
        Export: {
          Name: CATALOG_ITEMS_QUEUE_URL_EXPORT_NAME,
        },
      },
    },
    Resources: {
      productsTable: {
        Type: "AWS::DynamoDB::Table",
        DeletionPolicy: "Delete",
        Properties: {
          TableName: "products",
          AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
          KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          Tags: [{ Key: "Name", Value: "cloudx_products" }],
        },
      },
      stocksTable: {
        Type: "AWS::DynamoDB::Table",
        DeletionPolicy: "Delete",
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
      catalogItemsQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "catalog-items-queue",
        },
      },
      createProductTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "create-product-topic",
        },
      },
      createProductTopicSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "wegamo4838@fectode.com",
          Protocol: "email",
          TopicArn: { Ref: "createProductTopic" },
        },
      },
      createHighValueProductTopicSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "wemoweb829@fectode.com",
          Protocol: "email",
          TopicArn: { Ref: "createProductTopic" },
          FilterPolicy: {
            productsValue: [{ numeric: [">", 1000] }],
          },
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
      basePath: "/${sls:stage}",
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
