import {
  Entity,
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { FleetDMHost, FleetDMInstanceConfig } from '../../types';
import { Entities } from '../constants';

export const getOSVersion = (osVersion: string) =>
  osVersion.match(/(\d+(?:\.\d+)*)/)?.[0] || osVersion;

export const createHostEntity = (
  host: FleetDMHost,
  fleetDMConfiguration: FleetDMInstanceConfig,
): Entity => {
  return createIntegrationEntity({
    entityData: {
      source: host,
      assign: {
        _key: `${Entities.HOST._type}_${host.uuid}`,
        _type: Entities.HOST._type,
        _class: Entities.HOST._class,
        category: 'server',
        ...getCommonProperties(host, fleetDMConfiguration),
      },
    },
  });
};

export const createDeviceEntity = (
  host: FleetDMHost,
  fleetDMConfiguration: FleetDMInstanceConfig,
): Entity => {
  return createIntegrationEntity({
    entityData: {
      source: host,
      assign: {
        _key: host.hardware_serial || `${Entities.DEVICE._type}_${host.uuid}`,
        _type: Entities.DEVICE._type,
        _class: Entities.DEVICE._class,
        category: 'endpoint',
        ...getCommonProperties(host, fleetDMConfiguration),
      },
    },
  });
};

const getCommonProperties = (
  host: FleetDMHost,
  fleetDMConfiguration: FleetDMInstanceConfig,
) => ({
  /**
   * note: most of these properties were inspired by other integrations
   * and may be overkill.
   */
  id: host.uuid,
  displayName: host.display_name,
  name: host.display_name,
  webLink: `${fleetDMConfiguration.server_settings.server_url}/hosts/${host.id}`,
  status: host.status === 'online' ? 'deployed' : 'unknown',
  labels: (host.labels || []).map((label) => label.name),
  userEmails: (host.device_mapping || []).map((mapping) => mapping.email),
  version: host.os_version,
  deviceId: host.uuid,
  hardwareVendor: host.hardware_vendor,
  hardwareModel: host.hardware_model,
  hardwareVersion: host.hardware_version,
  hardwareSerial: host.hardware_serial,
  osDetails: host.os_version,
  macAddress: host.primary_mac,
  make: host.hardware_vendor,
  model: host.hardware_model,
  serial: host.hardware_serial,
  serialNumber: host.hardware_serial,
  systemVersion: host.os_version,
  osqueryVersion: host.osquery_version,
  publicIp: host.public_ip,
  publicIpAddress: host.public_ip,
  privateIp: host.primary_ip,
  privateIpAddress: host.primary_ip,
  ipAddresses: [host.primary_ip, host.public_ip],
  osName: host.os_version,
  hostname: host.hostname,
  deviceName: host.display_name,
  lastExternalIpAddress: host.public_ip,
  lastSeenOn: parseTimePropertyValue(host.seen_time),
  lastOnline: parseTimePropertyValue(host.seen_time),
  /**
   * Other integrations have this value set to only the numeric portion
   * of the version, so this function pulls it out. See the tests for examples.
   */
  osVersion: getOSVersion(host.os_version),
  /**
   * Converts b -> kb -> mb -> gb at 3 decimal places
   */
  totalMemory: parseFloat((host.memory / 1024 / 1024 / 1024).toFixed(3)),
  /**
   * Note that this number is not exact due to the lack of precision
   * on the `percent_disk_space_available` property.
   *
   * It may behoove us to not make claims with his property at all since it
   * could change every time we fetch the host
   */
  totalDiskSpace: Math.round(
    (100 * host.gigs_disk_space_available) / host.percent_disk_space_available,
  ),
  /**
   * Other integrations have this flag, so we're adding it here for consistency.
   */
  appleSilicon:
    host.hardware_vendor.includes('Apple') && host.cpu_type.includes('arm'),
  /**
   * These 2 properties intentionally assumes that the host platform is one of the big 3.
   * If it's not, we're defaulting to Linux since enumerating each OS flavor would
   * not be a simple task (ChromeOS, debian, Fedora, FreeBSD, etc.).
   *
   * Note: the value casing for `os` is to be consistent with other integrations.
   */
  platform: host.platform.match(/darwin/i)
    ? 'darwin'
    : host.platform.match(/win/i)
    ? 'windows'
    : 'linux',
  os: host.platform.match(/darwin/i)
    ? 'MAC'
    : host.platform.match(/win/i)
    ? 'WINDOWS'
    : 'LINUX',
  /**
   * Assumes that 16-bit and 128-bit processors aren't an option.
   */
  osArch: host.cpu_type.includes('64') ? '64 bit' : '32 bit',
});
