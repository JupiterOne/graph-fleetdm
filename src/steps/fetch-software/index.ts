import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';

export const fetchSoftwareSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_SOFTWARE,
    name: 'Fetch-Software',
    entities: [Entities.SOFTWARE],
    relationships: [Relationships.HOST_INSTALLED_SOFTWARE],
    dependsOn: [Steps.FETCH_HOSTS],
    executionHandler: fetchSoftware,
  },
];

export async function fetchSoftware({
  // jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await Promise.resolve();
  logger.info(fetchSoftwareSteps[0].name + ' is not implemented yet');
}
