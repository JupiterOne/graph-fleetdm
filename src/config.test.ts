import { parseConfig } from './config';
describe('parseConfig', () => {
  const defaults = { username: 'yo', password: 'oy' };

  test('should preserve plain hostname', () => {
    expect(
      parseConfig({
        ...defaults,
        hostname: 'fleetdm.boogersugar.com',
      }),
    ).toEqual({
      ...defaults,
      hostname: 'fleetdm.boogersugar.com',
    });
  });

  test('should strip trailing slash', () => {
    expect(
      parseConfig({
        ...defaults,
        hostname: 'fleetdm.boogersugar.com/',
      }),
    ).toEqual({
      ...defaults,
      hostname: 'fleetdm.boogersugar.com',
    });
  });

  test('should strip protocol', () => {
    expect(
      parseConfig({
        ...defaults,
        hostname: 'https://fleetdm.boogersugar.com',
      }),
    ).toEqual({
      ...defaults,
      hostname: 'fleetdm.boogersugar.com',
    });
  });
});
