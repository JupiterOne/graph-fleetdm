import {
  Recording,
  executeStepWithDependencies,
} from '@jupiterone/integration-sdk-testing';
import { setupProjectRecording } from '../../../test/recording';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Steps } from '../constants';
import { createAPIClient } from '../../client';

describe('Fetch account step', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'fetch-account',
    });
  });

  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });

  test('fetches account correctly', async () => {
    const stepConfig = buildStepTestConfigForStep(Steps.FETCH_ACCOUNT);
    await createAPIClient(stepConfig.instanceConfig).verifyAuthentication();
    const stepResult = await executeStepWithDependencies(stepConfig);
    expect(stepResult).toMatchStepMetadata(stepConfig);
  });
});
