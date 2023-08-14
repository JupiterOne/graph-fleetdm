// types for FleetDM

export interface FleetDMInstanceConfig {
  org_info: {
    org_name: string;
    org_logo_url: string;
    org_logo_url_light_background: string;
    contact_url: string;
  };
  server_settings: {
    server_url: string;
    live_query_disabled: boolean;
    enable_analytics: boolean;
    deferred_save_host: boolean;
  };
  license: {
    tier: string;
    expiration: string;
  };
  smtp_settings: any;
}

export interface FleetDMHost {
  created_at: string;
  updated_at: string;
  software_updated_at: string;
  id: number;
  detail_updated_at: string;
  label_updated_at: string;
  policy_updated_at: string;
  last_enrolled_at: string;
  seen_time: string;
  refetch_requested: boolean;
  hostname: string;
  uuid: string;
  platform: string;
  osquery_version: string;
  os_version: string;
  build: string;
  platform_like: string;
  code_name: string;
  uptime: number;
  memory: number;
  cpu_type: string;
  cpu_subtype: string;
  cpu_brand: string;
  cpu_physical_cores: number;
  cpu_logical_cores: number;
  hardware_vendor: string;
  hardware_model: string;
  hardware_version: string;
  hardware_serial: string;
  computer_name: string;
  public_ip: string;
  primary_ip: string;
  primary_mac: string;
  distributed_interval: number;
  config_tls_refresh: number;
  logger_tls_period: number;
  gigs_disk_space_available: number;
  percent_disk_space_available: number;
  issues: {
    total_issues_count: number;
    failing_policies_count: number;
  };
  mdm: {
    enrollment_status: string;
    server_url: string;
    name: string;
    encryption_key_available: boolean;
  };
  refetch_critical_queries_until: string;
  status: string;
  display_text: string;
  display_name: string;
}

export type LoginResponse = {
  token: string;
  available_teams: any[];
  user: {
    id: number;
    email: string;
    name: string;
    global_role: string;
    teams: any[];
    created_at: string;
    updated_at: string;
    api_only: boolean;
  };
} & {
  // for potential errors
  message: string;
};