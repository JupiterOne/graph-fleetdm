import {
  Entity,
  IntegrationMissingKeyError,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig, parseConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { createAPIClient } from '../../client';
import { createDeviceEntity, createHostEntity } from './converters';
import { FleetDMInstanceConfig } from '../../types';

export const fetchHostsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_HOSTS,
    name: 'Fetch-Hosts',
    entities: [Entities.HOST, Entities.DEVICE],
    relationships: [
      Relationships.INSTANCE_HAS_HOST,
      Relationships.INSTANCE_HAS_DEVICE,
    ],
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
  const fleetDMConfiguration =
    await jobState.getData<FleetDMInstanceConfig>('fleetdmInstance');
  const fleetDMEntity = await jobState.getData<Entity>('fleetdmEntity');
  if (!fleetDMConfiguration || !fleetDMEntity) {
    throw new IntegrationMissingKeyError(
      'FleetDM instance configuration is not found',
    );
  }
  const userEndpointLabels = parseConfig(instance.config, logger)
    .fleetdm_user_endpoint_labels as string[];
  await client.iterateHosts(async (host) => {
    /**
     * when the config has user endpoint labels listed, only those
     * hosts with the labels will be created as Device entities.
     *
     * the flow is structured this way so that only Device entities are
     * created if the list of labels is empty.
     */
    if (
      userEndpointLabels.length > 0 &&
      !host.labels?.find((label) => userEndpointLabels.includes(label.name))
    ) {
      /**
       * create a host entity and go next
       */
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
      return;
    }
    /**
     * create a device entity
     */
    const deviceEntity = await jobState.addEntity(
      createDeviceEntity(host, fleetDMConfiguration),
    );
    await jobState.addRelationship(
      createDirectRelationship({
        from: fleetDMEntity,
        to: deviceEntity,
        _class: RelationshipClass.HAS,
      }),
    );
  });
}
