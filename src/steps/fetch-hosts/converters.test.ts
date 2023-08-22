import { getOSVersion } from './converters';

describe('getOSVersion', () => {
  const versions = [
    ['0', '0'],
    ['0.0', '0.0'],
    ['0.0.0', '0.0.0'],
    ['0.0.0.0000', '0.0.0.0000'],
    ['0.0.0-alpha', '0.0.0'],
    ['macOS 13.5.0', '13.5.0'],
    ['Ubuntu 22.04.2 LTS', '22.04.2'],
    ['Windows 11 (22H2)', '11'],
  ];

  test.each(versions)(
    'getOSVersion("%s") should return "%s"',
    (input, expected) => {
      expect(getOSVersion(input)).toBe(expected);
    },
  );
});
