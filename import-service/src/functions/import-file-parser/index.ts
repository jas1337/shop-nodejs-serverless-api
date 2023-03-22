import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: "${self:custom.s3BucketName}",
        event: "s3:ObjectCreated:*",
        rules: [{ prefix: "uploaded/" }, { suffix: ".csv" }],
        existing: true,
      },
    },
  ],
};
