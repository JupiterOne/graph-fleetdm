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

| Resources | Entity `_type`     | Entity `_class` |
| --------- | ------------------ | --------------- |
| Host      | `fleetdm_host`     | `Host`          |
| Host      | `user_endpoint`    | `Device`        |
| Instance  | `fleetdm_instance` | `Account`       |
| Policy    | `fleetdm_policy`   | `ControlPolicy` |
| User      | `fleetdm_user`     | `User`          |

### Relationships

The following relationships are created:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` |
| --------------------- | --------------------- | --------------------- |
| `fleetdm_host`        | **VIOLATES**          | `fleetdm_policy`      |
| `fleetdm_instance`    | **HAS**               | `fleetdm_host`        |
| `fleetdm_instance`    | **HAS**               | `fleetdm_policy`      |
| `fleetdm_instance`    | **HAS**               | `fleetdm_user`        |
| `fleetdm_instance`    | **HAS**               | `user_endpoint`       |
| `fleetdm_policy`      | **ASSIGNED**          | `fleetdm_host`        |
| `fleetdm_policy`      | **ASSIGNED**          | `user_endpoint`       |
| `user_endpoint`       | **VIOLATES**          | `fleetdm_policy`      |

### Mapped Relationships

The following mapped relationships are created:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` | Direction |
| --------------------- | --------------------- | --------------------- | --------- |
| `fleetdm_host`        | **INSTALLED**         | `*fleetdm_software*`  | FORWARD   |
| `user_endpoint`       | **INSTALLED**         | `*fleetdm_software*`  | FORWARD   |

<!--
********************************************************************************
END OF GENERATED DOCUMENTATION AFTER BELOW MARKER
********************************************************************************
-->
<!-- {J1_DOCUMENTATION_MARKER_END} -->
