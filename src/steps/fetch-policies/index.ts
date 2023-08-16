import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';

export const fetechPoliciesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_POLICIES,
    name: 'Fetch-Policies',
    entities: [Entities.POLICY],
    relationships: [
      Relationships.INSTANCE_HAS_POLICY,
      Relationships.POLICY_ASSIGNED_HOST,
    ],
    dependsOn: [Steps.FETCH_HOSTS],
    executionHandler: fetechPolicies,
  },
];

export async function fetechPolicies({
  // jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await Promise.resolve();
  logger.info(fetechPoliciesSteps[0].name + ' is not implemented yet');
}
