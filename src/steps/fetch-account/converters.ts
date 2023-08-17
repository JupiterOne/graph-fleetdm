import {
  Entity,
  createIntegrationEntity,
} from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';
import { FleetDMInstanceConfig } from '../../types';
import { urlToKey } from '../../utils';

export const createInstanceEntity = (
  fleetDMConfiguration: FleetDMInstanceConfig,
): Entity => {
  return createIntegrationEntity({
    entityData: {
      source: fleetDMConfiguration,
      assign: {
        // The server URL is the most unique aspect of a FleetDM instance.
        _key: `${Entities.INSTANCE._type}:${urlToKey(
          fleetDMConfiguration.server_settings.server_url,
        )}`,
        _type: Entities.INSTANCE._type,
        _class: Entities.INSTANCE._class,
        displayName: fleetDMConfiguration.org_info.org_name,
        name: fleetDMConfiguration.org_info.org_name,
        webLink: fleetDMConfiguration.server_settings.server_url,
        tier: fleetDMConfiguration.license.tier,
        licenseExpirationDate: fleetDMConfiguration.license.expiration,
      },
    },
  });
};
