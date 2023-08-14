import { fetchAccountSteps } from './fetch-account';
import { fetchUsersSteps } from './fetch-users';
import { fetchHostsSteps } from './fetch-hosts';
import { fetechPoliciesSteps } from './fetch-policies';
import { fetchSoftwareSteps } from './fetch-software';

const integrationSteps = [
  ...fetchAccountSteps,
  ...fetchUsersSteps,
  ...fetchHostsSteps,
  ...fetechPoliciesSteps,
  ...fetchSoftwareSteps,
];

export { integrationSteps };
