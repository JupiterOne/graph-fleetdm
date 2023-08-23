import {
  Entity,
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { FleetDMInstanceConfig, FleetDMPolicy } from '../../types';
import { Entities } from '../constants';
import { urlToKey } from '../../helpers';

export const getPolicyKey = (
  fleetDMConfiguration: FleetDMInstanceConfig,
  policy_id: number,
): string =>
  `${Entities.POLICY._type}:${urlToKey(
    fleetDMConfiguration.server_settings.server_url,
  )}:${policy_id}`;

export const createPolicyEntity = (
  policy: FleetDMPolicy,
  fleetDMConfiguration: FleetDMInstanceConfig,
): Entity =>
  createIntegrationEntity({
    entityData: {
      source: policy,
      assign: {
        _key: getPolicyKey(fleetDMConfiguration, policy.id),
        _type: Entities.POLICY._type,
        _class: Entities.POLICY._class,
        id: policy.id.toString(),
        category: 'compliance',
        content: policy.query,
        webLink: `${fleetDMConfiguration.server_settings.server_url}/policies/${policy.id}`,
        displayName: policy.name,
        name: policy.name,
        description: policy.description,
        createdBy: policy.author_email,
        platform: policy.platform,
        createdOn: parseTimePropertyValue(policy.created_at),
        updatedOn: parseTimePropertyValue(policy.updated_at),
        failingHostCount: policy.failing_host_count,
        passingHostCount: policy.passing_host_count,
      },
    },
  });
