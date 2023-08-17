import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps: Record<
  | 'FETCH_ACCOUNT'
  | 'FETCH_USERS'
  | 'FETCH_HOSTS'
  | 'FETCH_POLICIES'
  | 'FETCH_SOFTWARE'
  | 'RELATE_HOSTS_TO_POLICIES',
  string
> = {
  FETCH_ACCOUNT: 'fetch-account',
  FETCH_USERS: 'fetch-users',
  FETCH_HOSTS: 'fetch-hosts',
  FETCH_POLICIES: 'fetch-policies',
  FETCH_SOFTWARE: 'fetch-software',
  RELATE_HOSTS_TO_POLICIES: 'relate-hosts-to-policies',
};

export const Entities: Record<
  'INSTANCE' | 'USER' | 'HOST' | 'POLICY' | 'SOFTWARE',
  StepEntityMetadata
> = {
  INSTANCE: {
    resourceName: 'Instance',
    _type: 'fleetdm_instance',
    _class: ['Account'],
  },
  USER: {
    resourceName: 'User',
    _type: 'fleetdm_user',
    _class: ['User'],
  },
  HOST: {
    resourceName: 'Host',
    _type: 'fleetdm_hostagent',
    _class: ['HostAgent'],
  },
  POLICY: {
    resourceName: 'Policy',
    _type: 'fleetdm_policy',
    _class: ['ControlPolicy'],
  },
  SOFTWARE: {
    resourceName: 'Software',
    _type: 'fleetdm_host_application',
    _class: ['Application'],
  },
};

export const Relationships: Record<
  | 'INSTANCE_HAS_USER'
  | 'INSTANCE_HAS_POLICY'
  | 'INSTANCE_HAS_HOST'
  | 'POLICY_ASSIGNED_HOST'
  | 'HOST_VIOLATES_POLICY'
  | 'HOST_INSTALLED_SOFTWARE',
  StepRelationshipMetadata
> = {
  INSTANCE_HAS_USER: {
    sourceType: Entities.INSTANCE._type,
    targetType: Entities.USER._type,
    _type: 'fleetdm_instance_has_user',
    _class: RelationshipClass.HAS,
  },
  INSTANCE_HAS_POLICY: {
    sourceType: Entities.INSTANCE._type,
    targetType: Entities.POLICY._type,
    _type: 'fleetdm_instance_has_policy',
    _class: RelationshipClass.HAS,
  },
  INSTANCE_HAS_HOST: {
    sourceType: Entities.INSTANCE._type,
    targetType: Entities.HOST._type,
    _type: 'fleetdm_instance_has_hostagent',
    _class: RelationshipClass.HAS,
  },
  POLICY_ASSIGNED_HOST: {
    sourceType: Entities.POLICY._type,
    targetType: Entities.HOST._type,
    _type: 'fleetdm_policy_assigned_hostagent',
    _class: RelationshipClass.ASSIGNED,
  },
  HOST_VIOLATES_POLICY: {
    sourceType: Entities.HOST._type,
    targetType: Entities.POLICY._type,
    _type: 'fleetdm_hostagent_violates_policy',
    _class: RelationshipClass.VIOLATES,
  },
  HOST_INSTALLED_SOFTWARE: {
    sourceType: Entities.HOST._type,
    targetType: Entities.SOFTWARE._type,
    _type: 'fleetdm_hostagent_installed_application',
    _class: RelationshipClass.INSTALLED,
  },
};
