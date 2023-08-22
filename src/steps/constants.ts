import {
  RelationshipClass,
  RelationshipDirection,
  StepEntityMetadata,
  StepMappedRelationshipMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';
import { generateRelationshipMetadata } from '../helpers';

export const Steps = {
  FETCH_ACCOUNT: 'fetch-account',
  FETCH_USERS: 'fetch-users',
  FETCH_HOSTS: 'fetch-hosts',
  FETCH_POLICIES: 'fetch-policies',
  RELATE_HOSTS_TO_SOFTWARE: 'relate-hosts-to-software',
  RELATE_HOSTS_TO_POLICIES: 'relate-hosts-to-policies',
  RELATE_INSTANCE_TO_USERS: 'relate-instance-to-users',
} satisfies Record<string, `fetch-${string}` | `relate-${string}-to-${string}`>;

export const Entities = {
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
  DEVICE: {
    resourceName: 'Host',
    _type: 'user_endpoint',
    _class: ['Device'],
  },
  HOST: {
    resourceName: 'Host',
    _type: 'fleetdm_host',
    _class: ['Host'],
  },
  POLICY: {
    resourceName: 'Policy',
    _type: 'fleetdm_policy',
    _class: ['ControlPolicy'],
  },
  SOFTWARE: {
    resourceName: 'Software',
    _type: 'fleetdm_software',
    _class: ['Application'],
  },
} satisfies Record<string, StepEntityMetadata>;

export const Relationships = {
  INSTANCE_HAS_USER: generateRelationshipMetadata({
    _class: RelationshipClass.HAS,
    from: Entities.INSTANCE,
    to: Entities.USER,
  }),
  INSTANCE_HAS_POLICY: generateRelationshipMetadata({
    _class: RelationshipClass.HAS,
    from: Entities.INSTANCE,
    to: Entities.POLICY,
  }),
  INSTANCE_HAS_DEVICE: generateRelationshipMetadata({
    _class: RelationshipClass.HAS,
    from: Entities.INSTANCE,
    to: Entities.DEVICE,
  }),
  INSTANCE_HAS_HOST: generateRelationshipMetadata({
    _class: RelationshipClass.HAS,
    from: Entities.INSTANCE,
    to: Entities.HOST,
  }),
  DEVICE_VIOLATES_POLICY: generateRelationshipMetadata({
    _class: RelationshipClass.VIOLATES,
    from: Entities.DEVICE,
    to: Entities.POLICY,
  }),
  DEVICE_INSTALLED_SOFTWARE: generateRelationshipMetadata({
    _class: RelationshipClass.INSTALLED,
    from: Entities.DEVICE,
    to: Entities.SOFTWARE,
  }),
  HOST_VIOLATES_POLICY: generateRelationshipMetadata({
    _class: RelationshipClass.VIOLATES,
    from: Entities.HOST,
    to: Entities.POLICY,
  }),
  HOST_INSTALLED_SOFTWARE: generateRelationshipMetadata({
    _class: RelationshipClass.INSTALLED,
    from: Entities.HOST,
    to: Entities.SOFTWARE,
  }),
  POLICY_ASSIGNED_DEVICE: generateRelationshipMetadata({
    _class: RelationshipClass.ASSIGNED,
    from: Entities.POLICY,
    to: Entities.DEVICE,
  }),
  POLICY_ASSIGNED_HOST: generateRelationshipMetadata({
    _class: RelationshipClass.ASSIGNED,
    from: Entities.POLICY,
    to: Entities.HOST,
  }),
} satisfies Record<string, StepRelationshipMetadata>;

export const MappedRelationships = {
  HOST_INSTALLED_SOFTWARE: {
    sourceType: Entities.HOST._type,
    targetType: Entities.SOFTWARE._type,
    _type: 'fleetdm_host_installed_application',
    _class: RelationshipClass.INSTALLED,
    direction: RelationshipDirection.FORWARD,
  },
  DEVICE_INSTALLED_SOFTWARE: {
    sourceType: Entities.DEVICE._type,
    targetType: Entities.SOFTWARE._type,
    _type: 'user_endpoint_installed_application',
    _class: RelationshipClass.INSTALLED,
    direction: RelationshipDirection.FORWARD,
  },
} satisfies Record<string, StepMappedRelationshipMetadata>;
