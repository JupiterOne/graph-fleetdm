import {
  Entity,
  IntegrationMissingKeyError,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { createAPIClient } from '../../client';
import { createPolicyEntity, getPolicyKey } from './converters';
import { FleetDMInstanceConfig, FleetDMPolicy } from '../../types';

export const fetchPoliciesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_POLICIES,
    name: 'Fetch-Policies',
    entities: [Entities.POLICY],
    relationships: [Relationships.INSTANCE_HAS_POLICY],
    dependsOn: [Steps.FETCH_HOSTS],
    executionHandler: fetchPolicies,
  },
  {
    id: Steps.RELATE_HOSTS_TO_POLICIES,
    name: 'Relate-Hosts-To-Policies',
    entities: [],
    relationships: [
      Relationships.POLICY_ASSIGNED_HOST,
      Relationships.HOST_VIOLATES_POLICY,
    ],
    dependsOn: [Steps.FETCH_HOSTS, Steps.FETCH_POLICIES],
    executionHandler: relateHostsToPolicies,
  },
];

export async function fetchPolicies({
  jobState,
  logger,
  instance,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createAPIClient(instance.config, logger);
  const fleetDMConfiguration = await jobState.getData<FleetDMInstanceConfig>(
    'fleetdmInstance',
  );
  const fleetDMEntity = await jobState.getData<Entity>('fleetdmEntity');
  if (!fleetDMConfiguration || !fleetDMEntity) {
    throw new IntegrationMissingKeyError(
      'FleetDM instance configuration is not found',
    );
  }
  /**
   * create policy entities
   */
  await client.iteratePolicies(async (policy) => {
    const policyEntity = await jobState.addEntity(
      createPolicyEntity(policy, fleetDMConfiguration),
    );
    await jobState.addRelationship(
      createDirectRelationship({
        from: fleetDMEntity,
        to: policyEntity,
        _class: RelationshipClass.HAS,
      }),
    );
  });
}

const getPoliciesFromRawData = (rawData: any): FleetDMPolicy[] => {
  const policies: FleetDMPolicy[] = [];
  if (rawData && rawData.length > 0) {
    rawData.forEach((rawDataItem: any) => {
      if (rawDataItem && rawDataItem.rawData && rawDataItem.rawData.policies) {
        policies.push(...rawDataItem.rawData.policies);
      }
    });
  }
  return policies;
};

export async function relateHostsToPolicies({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const fleetDMConfiguration = await jobState.getData<FleetDMInstanceConfig>(
    'fleetdmInstance',
  );
  if (!fleetDMConfiguration) {
    throw new IntegrationMissingKeyError(
      'FleetDM instance configuration is not found',
    );
  }
  await jobState.iterateEntities(Entities.HOST, async (hostEntity) => {
    const hostPolicies = getPoliciesFromRawData(hostEntity._rawData);
    for (const policy of hostPolicies) {
      const policyEntity = await jobState.findEntity(
        getPolicyKey(fleetDMConfiguration, policy.id),
      );
      if (!policyEntity) {
        throw new IntegrationMissingKeyError(
          `Policy entity not found for policy id: ${policy.id}`,
        );
      }
      /**
       * optionally add the VIOLATES relationship if it did not pass
       */
      if (policy.response === 'fail') {
        await jobState.addRelationship(
          createDirectRelationship({
            from: hostEntity,
            to: policyEntity,
            _class: RelationshipClass.VIOLATES,
          }),
        );
      }
      /**
       * always add the ASSIGNED relationship
       */
      await jobState.addRelationship(
        createDirectRelationship({
          from: policyEntity,
          to: hostEntity,
          _class: RelationshipClass.ASSIGNED,
        }),
      );
    }
  });
}
