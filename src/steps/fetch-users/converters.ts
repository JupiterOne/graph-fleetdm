import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';
import { createEntityKey } from '../../helpers';
import { FleetDMUser } from '../../types';

export function createUserEntity(user: FleetDMUser): Entity {
  const id = '' + user.id;
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _key: createEntityKey(Entities.USER, id),
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        displayName: user.name,
        createdOn: parseTimePropertyValue(user.created_at),
        username: user.email,
        admin: user.global_role === 'admin',
        email: user.email,
        name: user.name,
        id,
        picture: user.gravatar_url,
        ssoEnabled: user.sso_enabled,
      },
    },
  });
}
