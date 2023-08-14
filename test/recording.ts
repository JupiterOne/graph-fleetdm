import {
  setupRecording,
  Recording,
  SetupRecordingInput,
  mutations,
} from '@jupiterone/integration-sdk-testing';
import { FleetDMHost, LoginResponse } from '../src/types';
import { randomUUID } from 'crypto';

export { Recording };

export function setupProjectRecording(
  input: Omit<SetupRecordingInput, 'mutateEntry'>,
): Recording {
  return setupRecording({
    ...input,
    redactedRequestHeaders: ['Authorization'],
    redactedResponseHeaders: ['set-cookie'],
    mutateEntry: (entry) => redact(entry),
  });
}

// a more sophisticated redaction example below:

function getRedactedLoginResponse() {
  const response: LoginResponse = {
    user: {
      id: 1,
      name: 'sample user',
      email: 'sample@userland.net',
      global_role: 'admin',
      teams: [],
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      api_only: true,
    },
    token: '[REDACTED]',
    message: '',
    available_teams: [],
  };
  return response;
}

function redact(entry): void {
  if (entry.request.postData) {
    if (entry.request.url.match(/login/)) {
      entry.request.postData.text = '[REDACTED]';
    }
  }

  if (!entry.response.content.text) {
    return;
  }

  //let's unzip the entry so we can modify it
  mutations.unzipGzippedRecordingEntry(entry);

  if (entry.request.url.match(/login/)) {
    entry.response.content.text = JSON.stringify(getRedactedLoginResponse());
    return;
  }

  if (entry.request.url.match(/hosts/)) {
    const hosts: FleetDMHost[] = JSON.parse(entry.response.content.text).hosts;
    hosts.forEach((_, i) => {
      hosts[i].uuid = randomUUID();
      hosts[i].hardware_serial = `SERIAL${i}`;
      hosts[i].public_ip = `127.0.0.1`;
      hosts[i].primary_ip = `127.0.0.1`;
      hosts[i].primary_mac = `00:00:00:00:00:00`;
      hosts[i].display_text = `display${i}`;
      hosts[i].display_name = `display${i}`;
      hosts[i].computer_name = `name${i}`;
      hosts[i].hostname = `host${i}`;
    });
    entry.response.content.text = JSON.stringify({ hosts });
  }
}
