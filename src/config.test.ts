import { parseConfig } from './config';
describe('parseConfig', () => {
  const defaults = {
    fleetdm_user_email: 'yo@yo.yo',
    fleetdm_user_password: 'oy.oy@oy',
    fleetdm_user_endpoint_labels: [],
  };

  const defaultsWithHosname = {
    ...defaults,
    fleetdm_hostname: 'fleetdm.boogersugar.com',
  };

  test('should preserve plain hostname', () => {
    expect(
      parseConfig({
        ...defaults,
        fleetdm_hostname: 'fleetdm.boogersugar.com',
      }),
    ).toEqual(defaultsWithHosname);
  });

  test('should strip trailing slash', () => {
    expect(
      parseConfig({
        ...defaults,
        fleetdm_hostname: 'fleetdm.boogersugar.com/',
      }),
    ).toEqual(defaultsWithHosname);
  });

  test('should strip protocol', () => {
    expect(
      parseConfig({
        ...defaults,
        fleetdm_hostname: 'https://fleetdm.boogersugar.com',
      }),
    ).toEqual(defaultsWithHosname);
  });

  test('should parse list of strings', () => {
    const parsed = parseConfig({
      ...defaultsWithHosname,
      fleetdm_user_endpoint_labels: '["hello", "there"]',
    });
    expect(parsed).toEqual({
      ...defaultsWithHosname,
      fleetdm_user_endpoint_labels: ['hello', 'there'],
    });
    expect(parseConfig(parsed)).toEqual(parsed);

    const parsed2 = parseConfig({
      ...defaultsWithHosname,
      fleetdm_user_endpoint_labels: 'general,kenobi',
    });
    expect(parsed2).toEqual({
      ...defaultsWithHosname,
      fleetdm_user_endpoint_labels: ['general', 'kenobi'],
    });
    expect(parseConfig(parsed2)).toEqual(parsed2);
  });
});
