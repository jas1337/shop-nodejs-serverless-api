export const ERROR_MESSAGES = {
  NOT_FOUND: "Product not found",
  INTERNAL_SERVER_ERROR: "Internal server error",
};

const CLIENT_ORIGIN = "https://d25fwvg9qrlnyv.cloudfront.net";

export const headers = {
  "Access-Control-Allow-Origin": CLIENT_ORIGIN,
  "Access-Control-Allow-Credentials": true,
};
