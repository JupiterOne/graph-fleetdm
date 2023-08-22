import {
  Recording,
  executeStepWithDependencies,
} from '@jupiterone/integration-sdk-testing';
import { setupProjectRecording } from '../../../test/recording';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Steps } from '../constants';
import { createAPIClient } from '../../client';

describe('Fetch users step', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'fetch-users',
    });
  });

  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });
  test('fetches users correctly', async () => {
    const stepConfig = buildStepTestConfigForStep(Steps.FETCH_USERS);
    await createAPIClient(stepConfig.instanceConfig).verifyAuthentication();
    const stepResult = await executeStepWithDependencies(stepConfig);
    expect(stepResult).toMatchStepMetadata(stepConfig);
  }, 10000);
});
