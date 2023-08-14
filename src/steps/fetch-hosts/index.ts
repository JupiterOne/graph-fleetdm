import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { createAPIClient } from '../../client';
import { createHostEntity } from './converters';
import { FleetDMInstanceConfig } from '../../types';

export const fetchHostsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_HOSTS,
    name: 'Fetch-Hosts',
    entities: [Entities.HOST],
    relationships: [Relationships.INSTANCE_HAS_HOST],
    dependsOn: [Steps.FETCH_ACCOUNT],
    executionHandler: fetchHosts,
  },
];

export async function fetchHosts({
  jobState,
  instance,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createAPIClient(instance.config, logger);
  const fleetDMConfiguration = await jobState.getData<FleetDMInstanceConfig>(
    'fleetdmInstance',
  );
  const fleetDMEntity = await jobState.getData<Entity>('fleetdmEntity');
  if (!fleetDMConfiguration || !fleetDMEntity) {
    throw new Error('FleetDM instance configuration is not found');
  }
  await client.iterateHosts(async (host) => {
    const hostEntity = await jobState.addEntity(
      createHostEntity(host, fleetDMConfiguration),
    );
    await jobState.addRelationship(
      createDirectRelationship({
        from: fleetDMEntity,
        to: hostEntity,
        _class: RelationshipClass.HAS,
      }),
    );
  });
}
