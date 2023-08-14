import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from './client';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  username: {
    type: 'string',
    mask: false,
  },
  password: {
    type: 'string',
    mask: true,
  },
  hostname: {
    type: 'string',
    mask: false,
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  username: string;
  password: string;
  hostname: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  const apiClient = createAPIClient(config);
  await apiClient.verifyAuthentication();
}

export function parseConfig(
  initialConfig: IntegrationConfig,
): IntegrationConfig {
  const config = { ...initialConfig };
  if (!config.username || !config.password || !config.hostname) {
    throw new IntegrationValidationError(
      'Config requires all of username,password,hostname',
    );
  }
  if (config.hostname.startsWith('http')) {
    if (!config.hostname.startsWith('https')) {
      throw new IntegrationValidationError(
        'Config hostname must be TLS-enabled with https://',
      );
    }
    config.hostname = new URL(config.hostname).hostname;
  }
  // don't allow trailing slash
  config.hostname = config.hostname.replace(/\/$/, '');
  return config;
}
