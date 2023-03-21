export const ERROR_MESSAGES = {
  OK: "Status OK",
  NOT_FOUND: "Product not found",
  INTERNAL_SERVER_ERROR: "Internal server error",
  BAD_REQUEST: "Bad request",
};

export const headers = {
  "Access-Control-Allow-Origin":
    process.env["ENV_NAME"] === "prod"
      ? "https://d25fwvg9qrlnyv.cloudfront.net"
      : "*",
  "Access-Control-Allow-Credentials": true,
};
