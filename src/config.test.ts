import { parseConfig } from './config';
describe('parseConfig', () => {
  const defaults = {
    fleetdm_user_email: 'yo@yo.yo',
    fleetdm_user_password: 'oy.oy@oy',
  };

  test('should preserve plain hostname', () => {
    expect(
      parseConfig({
        ...defaults,
        fleetdm_hostname: 'fleetdm.boogersugar.com',
      }),
    ).toEqual({
      ...defaults,
      fleetdm_hostname: 'fleetdm.boogersugar.com',
    });
  });

  test('should strip trailing slash', () => {
    expect(
      parseConfig({
        ...defaults,
        fleetdm_hostname: 'fleetdm.boogersugar.com/',
      }),
    ).toEqual({
      ...defaults,
      fleetdm_hostname: 'fleetdm.boogersugar.com',
    });
  });

  test('should strip protocol', () => {
    expect(
      parseConfig({
        ...defaults,
        fleetdm_hostname: 'https://fleetdm.boogersugar.com',
      }),
    ).toEqual({
      ...defaults,
      fleetdm_hostname: 'fleetdm.boogersugar.com',
    });
  });
});
