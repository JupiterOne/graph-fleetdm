import {
  Entity,
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { FleetDMHost, FleetDMInstanceConfig } from '../../types';
import { Entities } from '../constants';

export const createHostEntity = (
  host: FleetDMHost,
  fleetDMConfiguration: FleetDMInstanceConfig,
): Entity => {
  return createIntegrationEntity({
    entityData: {
      source: host,
      assign: {
        _key: `${Entities.HOST._type}:${host.uuid}`,
        _type: Entities.HOST._type,
        _class: Entities.HOST._class,
        id: host.uuid,
        displayName: host.hostname,
        name: host.hostname,
        webLink: `${fleetDMConfiguration.server_settings.server_url}/hosts/${host.id}`,
        function: ['endpoint-compliance', 'vulnerability-detection'],
        lastSeenOn: parseTimePropertyValue(host.seen_time),
      },
    },
  });
};
