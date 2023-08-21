export const urlToKey = (keyPart: string): string =>
  keyPart.split(/[^a-zA-Z0-9]+/).join('-');
