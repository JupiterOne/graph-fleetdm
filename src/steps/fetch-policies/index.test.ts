import {
  Recording,
  executeStepWithDependencies,
} from '@jupiterone/integration-sdk-testing';
import { setupProjectRecording } from '../../../test/recording';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Steps } from '../constants';
import { createAPIClient } from '../../client';

describe('Fetch policies step', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'fetch-policies',
    });
  });

  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });

  test('fetches policies correctly', async () => {
    const stepConfig = buildStepTestConfigForStep(Steps.FETCH_POLICIES);
    await createAPIClient(stepConfig.instanceConfig).verifyAuthentication();
    const stepResult = await executeStepWithDependencies(stepConfig);
    expect(stepResult).toMatchStepMetadata(stepConfig);
  });
});
