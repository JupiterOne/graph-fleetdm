import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities } from '../constants';
import { createAPIClient } from '../../client';
import { createInstanceEntity } from './converters';
import { getStepName } from '../../helpers';

export const fetchAccountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_ACCOUNT,
    name: getStepName(Steps.FETCH_ACCOUNT),
    entities: [Entities.INSTANCE],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchAccount,
  },
];

export async function fetchAccount({
  jobState,
  instance,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createAPIClient(instance.config, logger);
  const fleetdmInstance = await client.getAccount();
  await jobState.addEntity(createInstanceEntity(fleetdmInstance));
  await jobState.setData('fleetdmInstance', fleetdmInstance);
}
