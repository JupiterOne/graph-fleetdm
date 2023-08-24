import {
  Entity,
  createIntegrationEntity,
} from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';
import { FleetDMInstanceConfig } from '../../types';
import { createEntityKey, urlToKey } from '../../helpers';

export const createInstanceEntity = (
  fleetDMConfiguration: FleetDMInstanceConfig,
): Entity => {
  return createIntegrationEntity({
    entityData: {
      source: fleetDMConfiguration,
      assign: {
        // The server URL is the most unique aspect of a FleetDM instance.
        _key: createInstanceEntityKey(fleetDMConfiguration),
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

export const createInstanceEntityKey = (
  fleetDMConfiguration: FleetDMInstanceConfig,
) =>
  createEntityKey(
    Entities.INSTANCE,
    urlToKey(fleetDMConfiguration.server_settings.server_url),
  );
