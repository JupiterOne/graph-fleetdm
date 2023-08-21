import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
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
): IntegrationConfig {
  const config = { ...initialConfig };
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
    config.fleetdm_user_endpoint_labels = [];
  } else if (typeof origLabels === 'string') {
    if (origLabels.startsWith('[') && origLabels.endsWith(']')) {
      config.fleetdm_user_endpoint_labels = JSON.parse(origLabels);
    } else {
      config.fleetdm_user_endpoint_labels = origLabels.split(',');
    }
  } else if (!Array.isArray(origLabels)) {
    throw new IntegrationValidationError(
      'Config fleetdm_user_endpoint_labels must be an array of strings',
    );
  }

  // don't allow trailing slash
  config.fleetdm_hostname = config.fleetdm_hostname.replace(/\/$/, '');
  return config;
}
