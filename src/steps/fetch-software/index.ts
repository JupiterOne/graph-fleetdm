import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  StepMappedRelationshipMetadata,
  createMappedRelationship,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, MappedRelationships } from '../constants';
import { FleetDMSoftware } from '../../types';
import { getStepName } from '../../helpers';

export const fetchSoftwareSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.RELATE_HOSTS_TO_SOFTWARE,
    name: getStepName(Steps.RELATE_HOSTS_TO_SOFTWARE),
    entities: [],
    relationships: [],
    mappedRelationships: [
      MappedRelationships.HOST_INSTALLED_SOFTWARE,
      MappedRelationships.DEVICE_INSTALLED_SOFTWARE,
    ],
    dependsOn: [Steps.FETCH_HOSTS],
    executionHandler: createHostInstalledSoftwareRelationships,
  },
];

const getSoftwareFromRawData = (rawData: any): FleetDMSoftware[] => {
  const software: FleetDMSoftware[] = [];
  if (rawData && rawData.length > 0) {
    rawData.forEach((rawDataItem: any) => {
      if (rawDataItem && rawDataItem.rawData && rawDataItem.rawData.software) {
        software.push(...rawDataItem.rawData.software);
      }
    });
  }
  return software;
};

export async function createHostInstalledSoftwareRelationships({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const getIterator =
    (metadata: StepMappedRelationshipMetadata) =>
    async (hostEntity: Entity) => {
      const hostSoftware = getSoftwareFromRawData(hostEntity._rawData);
      const mappedRelationshipKeySet = new Set<string>();
      for (const application of hostSoftware) {
        const softwareEntityKey = `${Entities.SOFTWARE._type}_${application.name}_${application.version}`;

        const mappedRelationshipKey = `${
          hostEntity._key
        }_${metadata._class.toLowerCase()}_${softwareEntityKey}`;

        if (mappedRelationshipKeySet.has(mappedRelationshipKey)) {
          continue;
        }

        await jobState.addRelationship(
          createMappedRelationship({
            _key: mappedRelationshipKey,
            _class: metadata._class,
            _type: metadata._type,
            _mapping: {
              relationshipDirection: metadata.direction,
              sourceEntityKey: hostEntity._key,
              skipTargetCreation: false,
              targetFilterKeys: [['_type', 'name']],
              targetEntity: {
                _class: Entities.SOFTWARE._class,
                _type: Entities.SOFTWARE._type,
                displayName: application.name,
                name: application.name,
                version: application.version,
                path: application.installed_paths?.[0],
              },
            },
            properties: {
              path: application.installed_paths?.[0],
              version: application.version,
            },
          }),
        );
        mappedRelationshipKeySet.add(mappedRelationshipKey);
      }
    };
  await jobState.iterateEntities(
    Entities.HOST,
    getIterator(MappedRelationships.HOST_INSTALLED_SOFTWARE),
  );
  await jobState.iterateEntities(
    Entities.DEVICE,
    getIterator(MappedRelationships.DEVICE_INSTALLED_SOFTWARE),
  );
}
