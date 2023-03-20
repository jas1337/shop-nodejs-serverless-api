import pino from "pino";
import { lambdaRequestTracker, pinoLambdaDestination } from "pino-lambda";

export const logger = pino(pinoLambdaDestination());
export const withRequest = lambdaRequestTracker();
