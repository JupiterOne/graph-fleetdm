import {
  IntegrationLogger,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, parseConfig } from './config';
import { Gaxios } from 'gaxios';
import { FleetDMHost, FleetDMInstanceConfig, LoginResponse } from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 * It is recommended that integrations wrap provider data APIs to provide a
 * place to handle error responses and implement common patterns for iterating
 * resources.
 */
export class APIClient {
  private _gaxios: Gaxios;
  private logger?: IntegrationLogger;
  constructor(readonly config: IntegrationConfig, logger?: IntegrationLogger) {
    this.logger = logger;
    this._gaxios = new Gaxios({
      baseURL: `https://${config.hostname}/api/v1/fleet`,
    });
  }

  public async verifyAuthentication(): Promise<void> {
    const { status, data } = await this._gaxios.request<LoginResponse>({
      url: '/login',
      method: 'POST',
      data: { email: this.config.username, password: this.config.password },
    });

    if (status == 200) {
      if (data.user.global_role !== 'admin') {
        throw new IntegrationProviderAuthenticationError({
          endpoint: '/login',
          cause: new Error('User is not an admin'),
          status,
          statusText: 'OK',
        });
      }

      this._gaxios.defaults.headers = {
        ...this._gaxios.defaults.headers,
        Authorization: `Bearer ${data.token}`,
      };

      this.logger?.info({ data }, 'Successfully authenticated');
    } else {
      throw new IntegrationProviderAuthenticationError({
        endpoint: '/login',
        cause: new Error(data.message),
        status,
        statusText: 'Unauthorized',
      });
    }
    return Promise.resolve();
  }

  public async getAccount(): Promise<FleetDMInstanceConfig> {
    const { data } = await this._gaxios.request<FleetDMInstanceConfig>({
      url: '/config',
    });

    // potentially exposes something secret
    delete data.smtp_settings;

    return data;
  }

  public async iterateHosts(
    iteratee: ResourceIteratee<FleetDMHost>,
  ): Promise<void> {
    const per_page = 250;
    const MAX_PAGES = 10000;

    for (let page = 0; page < MAX_PAGES; page++) {
      const { data } = await this._gaxios.request<{ hosts: FleetDMHost[] }>({
        url: '/hosts',
        params: { page, per_page },
      });

      if (data.hosts.length === 0) break;
      await Promise.all(data.hosts.map(iteratee));
    }
  }
}

const API_CLIENTS = new Map<string, APIClient>();

export function createAPIClient(
  _config: IntegrationConfig,
  logger?: IntegrationLogger,
): APIClient {
  const config = parseConfig(_config);
  const _key = `${config.hostname}:${config.username}`;

  if (!API_CLIENTS.has(_key)) {
    API_CLIENTS.set(_key, new APIClient(config, logger));
  }

  return API_CLIENTS.get(_key)!;
}
