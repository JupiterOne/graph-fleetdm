import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { StepTestConfig } from '@jupiterone/integration-sdk-testing';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { invocationConfig } from '../src';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}

export const integrationConfig: IntegrationConfig = {
  username: process.env.USERNAME || 'test.username@testdomain.net',
  password: process.env.PASSWORD || 'test.password',
  hostname: process.env.HOSTNAME || 'fleetdm.testdomain.net',
};

export function buildStepTestConfigForStep(
  stepId: string,
): StepTestConfig<IntegrationInvocationConfig, IntegrationConfig> {
  return {
    stepId,
    instanceConfig: integrationConfig,
    invocationConfig: invocationConfig as IntegrationInvocationConfig,
  };
}
