import {
  Entity,
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
  createDirectRelationship,
  generateRelationshipType,
} from '@jupiterone/integration-sdk-core';
import { Steps } from './steps/constants';

export const createEntityKey = (
  entityMetadata: StepEntityMetadata,
  id: string,
) => {
  return `${entityMetadata._type}:${id}`;
};

export const createRelationship = ({
  relationship,
  from,
  to,
}: {
  relationship: StepRelationshipMetadata;
  from: Entity;
  to: Entity;
}) => {
  return createDirectRelationship({
    _class: relationship._class,
    from,
    to,
  });
};

export const generateRelationshipMetadata = ({
  _class,
  from,
  to,
}: {
  _class: RelationshipClass;
  from: StepEntityMetadata;
  to: StepEntityMetadata;
}) =>
  ({
    _type: generateRelationshipType(_class, from, to),
    sourceType: from._type,
    _class,
    targetType: to._type,
  }) satisfies StepRelationshipMetadata;

const capitalizeFirstChar = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getStepName = (step: (typeof Steps)[keyof typeof Steps]) => {
  return capitalizeFirstChar(step.split('-').join(' '));
};

export const urlToKey = (keyPart: string): string =>
  keyPart.split(/[^a-zA-Z0-9]+/).join('-');
