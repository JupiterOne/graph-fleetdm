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
  fleetdm_user_email: process.env.FLEETDM_USER_EMAIL || 'test@user.net',
  fleetdm_user_password: process.env.FLEETDM_USER_PASSWORD || 'test.password',
  fleetdm_hostname: process.env.FLEETDM_HOSTNAME || 'fleetdm.dev.jupiterone.io', // this has to match for recordings
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
