import {
  Recording,
  executeStepWithDependencies,
} from '@jupiterone/integration-sdk-testing';
import { setupProjectRecording } from '../../../test/recording';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Steps } from '../constants';
import { createAPIClient } from '../../client';

describe('Fetch hosts step', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'fetch-hosts',
    });
  });

  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });

  test('fetches hosts correctly', async () => {
    const stepConfig = buildStepTestConfigForStep(Steps.FETCH_HOSTS);
    await createAPIClient(stepConfig.instanceConfig).verifyAuthentication();
    const stepResult = await executeStepWithDependencies(stepConfig);
    expect(stepResult).toMatchStepMetadata(stepConfig);
  });
});
