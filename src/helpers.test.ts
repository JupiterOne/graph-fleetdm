import { getStepName } from './helpers';
import { Steps } from './steps/constants';
describe('helpers', () => {
  test('should get correct step name', () => {
    expect(getStepName(Steps.FETCH_ACCOUNT)).toEqual('Fetch account');

    expect(getStepName(Steps.RELATE_HOSTS_TO_POLICIES)).toEqual(
      'Relate hosts to policies',
    );
  });
});
