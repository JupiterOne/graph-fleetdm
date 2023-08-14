# FleetDM

<!-- {J1_DOCUMENTATION_MARKER_START} -->
<!--
********************************************************************************
NOTE: ALL OF THE FOLLOWING DOCUMENTATION IS GENERATED USING THE
"j1-integration document" COMMAND. DO NOT EDIT BY HAND! PLEASE SEE THE DEVELOPER
DOCUMENTATION FOR USAGE INFORMATION:

https://github.com/JupiterOne/sdk/blob/main/docs/integrations/development.md
********************************************************************************
-->

## Data Model

### Entities

The following entities are created:

| Resources | Entity `_type`             | Entity `_class` |
| --------- | -------------------------- | --------------- |
| Host      | `fleetdm_hostagent`        | `HostAgent`     |
| Instance  | `fleetdm_instance`         | `Account`       |
| Policy    | `fleetdm_policy`           | `ControlPolicy` |
| Software  | `fleetdm_host_application` | `Application`   |
| User      | `fleetdm_user`             | `User`          |

### Relationships

The following relationships are created:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type`      |
| --------------------- | --------------------- | -------------------------- |
| `fleetdm_hostagent`   | **INSTALLED**         | `fleetdm_host_application` |
| `fleetdm_instance`    | **HAS**               | `fleetdm_hostagent`        |
| `fleetdm_instance`    | **HAS**               | `fleetdm_policy`           |
| `fleetdm_instance`    | **HAS**               | `fleetdm_user`             |
| `fleetdm_policy`      | **ASSIGNED**          | `fleetdm_hostagent`        |

<!--
********************************************************************************
END OF GENERATED DOCUMENTATION AFTER BELOW MARKER
********************************************************************************
-->
<!-- {J1_DOCUMENTATION_MARKER_END} -->
