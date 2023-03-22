export const headers = {
  "Access-Control-Allow-Origin":
    process.env["ENV_NAME"] === "prod"
      ? "https://d25fwvg9qrlnyv.cloudfront.net"
      : "*",
  "Access-Control-Allow-Credentials": true,
};
