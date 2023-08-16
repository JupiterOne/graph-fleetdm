import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';

export const fetchUsersSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_USERS,
    name: 'Fetch-Users',
    entities: [Entities.USER],
    relationships: [Relationships.INSTANCE_HAS_USER],
    dependsOn: [Steps.FETCH_ACCOUNT],
    executionHandler: fetchUsers,
  },
];

export async function fetchUsers({
  // jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await Promise.resolve();
  logger.info(fetchUsersSteps[0].name + ' is not implemented yet');
}
