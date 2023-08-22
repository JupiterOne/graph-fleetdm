import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { getStepName } from '../../helpers';

export const fetchSoftwareSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_SOFTWARE,
    name: getStepName(Steps.FETCH_SOFTWARE),
    entities: [Entities.SOFTWARE],
    relationships: [
      Relationships.HOST_INSTALLED_SOFTWARE,
      Relationships.DEVICE_INSTALLED_SOFTWARE,
    ],
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
