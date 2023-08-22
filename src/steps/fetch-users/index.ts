import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { createAPIClient } from '../../client';
import { createUserEntity } from './converters';
import { createRelationship } from '../../helpers';
import { createInstanceEntityKey } from '../fetch-account/converters';
import { FleetDMInstanceConfig } from '../../types';

export const fetchUsersSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_USERS,
    name: Steps.FETCH_USERS,
    entities: [Entities.USER],
    relationships: [],
    dependsOn: [Steps.FETCH_ACCOUNT],
    executionHandler: fetchUsers,
  },
  {
    id: Steps.RELATE_INSTANCE_TO_USERS,
    name: Steps.RELATE_INSTANCE_TO_USERS,
    entities: [],
    relationships: [Relationships.INSTANCE_HAS_USER],
    dependsOn: [Steps.FETCH_ACCOUNT, Steps.FETCH_USERS],
    executionHandler: relateInstanceToUsers,
  },
];

export async function fetchUsers({
  jobState,
  instance,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createAPIClient(instance.config, logger);
  await client.iterateUsers(async (user) => {
    await jobState.addEntity(createUserEntity(user));
  });
}

export async function relateInstanceToUsers({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const fleetDMInstance = await jobState.getData<FleetDMInstanceConfig>(
    'fleetdmInstance',
  );

  if (!fleetDMInstance) {
    throw new Error('FleetDM instance configuration is not found');
  }

  const fleetDMInstanceEntity = await jobState.findEntity(
    createInstanceEntityKey(fleetDMInstance),
  );

  if (!fleetDMInstanceEntity) {
    throw new Error('FleetDM instance configuration is not found');
  }

  await jobState.iterateEntities(Entities.USER, async (userEntity) => {
    await jobState.addRelationship(
      createRelationship({
        from: fleetDMInstanceEntity,
        to: userEntity,
        relationship: Relationships.INSTANCE_HAS_USER,
      }),
    );
  });
}
