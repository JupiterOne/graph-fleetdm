import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
  IntegrationLogger,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from './client';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  fleetdm_user_email: {
    type: 'string',
    mask: false,
  },
  fleetdm_user_password: {
    type: 'string',
    mask: true,
  },
  fleetdm_hostname: {
    type: 'string',
    mask: false,
  },
  fleetdm_user_endpoint_labels: {
    type: 'string',
    mask: false,
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  fleetdm_user_email: string;
  fleetdm_user_password: string;
  fleetdm_hostname: string;
  fleetdm_user_endpoint_labels: string[] | string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  const apiClient = createAPIClient(config);
  await apiClient.verifyAuthentication();
  await apiClient.validateUserEndpointLabels();
}

export function parseConfig(
  initialConfig: IntegrationConfig,
  logger?: IntegrationLogger,
): IntegrationConfig {
  const config = { ...initialConfig };
  logger?.info('Parsing config');
  if (
    !config.fleetdm_user_email ||
    !config.fleetdm_user_password ||
    !config.fleetdm_hostname
  ) {
    throw new IntegrationValidationError(
      'Config requires all of fleetdm_user_email,fleetdm_user_password,fleetdm_hostname',
    );
  }
  if (config.fleetdm_hostname.startsWith('http')) {
    if (!config.fleetdm_hostname.startsWith('https')) {
      throw new IntegrationValidationError(
        'Config hostname must be TLS-enabled with https://',
      );
    }
    config.fleetdm_hostname = new URL(config.fleetdm_hostname).hostname;
  }

  const origLabels = config.fleetdm_user_endpoint_labels;

  if (!origLabels) {
    logger?.info('No labels specified, all hosts will be user endpoints');
    config.fleetdm_user_endpoint_labels = [];
  } else if (typeof origLabels === 'string') {
    if (origLabels.startsWith('[') && origLabels.endsWith(']')) {
      logger?.info('Parsing user endpoint labels as JSON array of strings');
      config.fleetdm_user_endpoint_labels = JSON.parse(origLabels);
    } else {
      logger?.info('Parsing user endpoint labels as comma-separated values');
      config.fleetdm_user_endpoint_labels = origLabels
        .split(',')
        .map((s) => s.trim());
    }
  } else if (!Array.isArray(origLabels)) {
    throw new IntegrationValidationError(
      'Config fleetdm_user_endpoint_labels must be a string or an array of strings',
    );
  }

  // don't allow trailing slash
  config.fleetdm_hostname = config.fleetdm_hostname.replace(/\/$/, '');
  return config;
}
