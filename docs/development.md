# Development

## Prerequisites

This integration requires a deployed FleetDM instance. See the
[FleetDM Guides](https://fleetdm.com/docs/get-started/tutorials-and-guides) for
more information on how to deploy.

Install the FleetDM CLI tool, `fleetctl`:

```sh
npm install -g fleetctl
```

Then, log in to your FleetDM instance using administrative credentials:

```sh
  fleetctl login
```

## Provider account setup

Once you have a FleetDM instance deployed and the `fleetctl` command ready, you
will need to enroll a few hosts. On the `Hosts` page, click the `Add hosts`
button and copy the command. This command will look something like:

```sh
fleetctl package --type=pkg --fleet-desktop --fleet-url=https://your-fleet-instance.net --enroll-secret=gobbledygook
```

Run that command and distribute the resulting installer package to each host and
execute/depackage.

### Optional setup

If you want specific hosts to be added as user endpoints in JupiterOne, you can
do so by adding a label for those hosts and then specifying that label in the
integration configuration.

Once the hosts show up in the list, create a label by clicking the
`Filter by...` dropdown and selecting `Add label`.

Write a query that will produce results for the hosts you want to add as user
endpoints to JupiterOne. For example, if you only want hosts that have an MDM
enrolled, you can use the following query:

```sql
SELECT * FROM mdm WHERE enrolled = 'true';
```

Once the label is created, it may take up to an hour for the hosts to be
filtered by that label, depending on how FleetDM is configured. The default
interval in FleetDM for labels is 1h.

## Authentication

Create
[an API-only user](https://fleetdm.com/docs/using-fleet/fleetctl-cli#using-fleetctl-with-an-api-only-user)
for the integration to use. This user should have the `admin` global role.

```sh
fleetctl user create --name "API User" --email api@example.com --password temp#pass --api-only --global-role admin
```

Add the credentials to a `.env` file at the root fo this repository (see
`.env.example`) for an example.

## Optional Configuration

To specify which hosts to import as user endpoints, update the
FLEETDM_USER_ENDPOINT_LABELS value in the `.env` file to be a json-encoded array
of strings. For example:

```sh
FLEETDM_USER_ENDPOINT_LABELS='["mdm"]'
```

This will cause any hosts that are not labeled with one of the labels in the
list to be pulled into JupiterOne as Host entities.
