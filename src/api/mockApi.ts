// src/api/mockApi.ts

// I am using mockApi due to a 401 unauthorized error when trying to access the API, even from the docs.
// This function simulates an API call and returns the provided graph data as a Promise.
export const fetchActionBlueprintGraph = async () => {
  // The data below is the static object you provided
  return Promise.resolve({
    "$schema": "https://example.com/schemas/ActionBlueprintGraphDescription.json",
    "blueprint_id": "bp_12345",
    "blueprint_name": "Customer Onboarding",
    "branches": [
      {
        "$schema": "https://example.com/schemas/ActionBranchDescription.json",
        "condition": {
          "left": {
            "object": "client",
            "property": "name",
            "type": "property"
          },
          "operator": "==",
          "right": {
            "type": "literal",
            "value": "John"
          },
          "type": "binary"
        },
        "created_at": "2024-10-29T11:22:33.027873-03:00",
        "created_by": "test@avantos.ai",
        "description": "Description for example branch",
        "id": "b_01jbcagb1wfy2v0g1xcq53y4rn",
        "name": "Dummy Branch",
        "tenant_id": "123",
        "updated_at": "2024-10-29T11:22:33.02018-03:00"
      }
    ],
    "edges": [
      { "source": "formA", "target": "formB" },
      { "source": "formA", "target": "formC" },
      { "source": "formB", "target": "formD" },
      { "source": "formC", "target": "formE" },
      { "source": "formB", "target": "formF" }
    ],
    "forms": [
      {
        "$schema": "https://example.com/schemas/ActionFormDescription.json",
        "created_at": "2024-01-01T00:00:00Z",
        "created_by": "user@email.com",
        "custom_javascript": "",
        "custom_javascript_triggering_fields": [],
        "description": "Root form",
        "dynamic_field_config": {},
        "field_schema": {
          "additionalProperties": {},
          "properties": { "email": null, "first_name": null },
          "required": ["email"],
          "type": "object"
        },
        "id": "formA",
        "is_reusable": true,
        "name": "Form A",
        "ui_schema": { "elements": [], "type": "object" },
        "updated_at": "2024-01-01T00:00:00Z"
      },
      {
        "$schema": "https://example.com/schemas/ActionFormDescription.json",
        "created_at": "2024-01-01T00:00:00Z",
        "created_by": "user@email.com",
        "custom_javascript": "",
        "custom_javascript_triggering_fields": [],
        "description": "Depends on A",
        "dynamic_field_config": {},
        "field_schema": {
          "additionalProperties": {},
          "properties": { "dynamic_checkbox_group": null, "dynamic_object": null, "email": null },
          "required": ["email"],
          "type": "object"
        },
        "id": "formB",
        "is_reusable": true,
        "name": "Form B",
        "ui_schema": { "elements": [], "type": "object" },
        "updated_at": "2024-01-01T00:00:00Z"
      },
      {
        "$schema": "https://example.com/schemas/ActionFormDescription.json",
        "created_at": "2024-01-01T00:00:00Z",
        "created_by": "user@email.com",
        "custom_javascript": "",
        "custom_javascript_triggering_fields": [],
        "description": "Depends on A",
        "dynamic_field_config": {},
        "field_schema": {
          "additionalProperties": {},
          "properties": { "address": null, "phone": null },
          "required": ["address"],
          "type": "object"
        },
        "id": "formC",
        "is_reusable": true,
        "name": "Form C",
        "ui_schema": { "elements": [], "type": "object" },
        "updated_at": "2024-01-01T00:00:00Z"
      },
      {
        "$schema": "https://example.com/schemas/ActionFormDescription.json",
        "created_at": "2024-01-01T00:00:00Z",
        "created_by": "user@email.com",
        "custom_javascript": "",
        "custom_javascript_triggering_fields": [],
        "description": "Depends on B",
        "dynamic_field_config": {},
        "field_schema": {
          "additionalProperties": {},
          "properties": { "dynamic_checkbox_group": null, "dynamic_object": null, "email": null },
          "required": ["email"],
          "type": "object"
        },
        "id": "formD",
        "is_reusable": true,
        "name": "Form D",
        "ui_schema": { "elements": [], "type": "object" },
        "updated_at": "2024-01-01T00:00:00Z"
      },
      {
        "$schema": "https://example.com/schemas/ActionFormDescription.json",
        "created_at": "2024-01-01T00:00:00Z",
        "created_by": "user@email.com",
        "custom_javascript": "",
        "custom_javascript_triggering_fields": [],
        "description": "Depends on C",
        "dynamic_field_config": {},
        "field_schema": {
          "additionalProperties": {},
          "properties": { "notes": null, "status": null },
          "required": ["notes"],
          "type": "object"
        },
        "id": "formE",
        "is_reusable": true,
        "name": "Form E",
        "ui_schema": { "elements": [], "type": "object" },
        "updated_at": "2024-01-01T00:00:00Z"
      },
      {
        "$schema": "https://example.com/schemas/ActionFormDescription.json",
        "created_at": "2024-01-01T00:00:00Z",
        "created_by": "user@email.com",
        "custom_javascript": "",
        "custom_javascript_triggering_fields": [],
        "description": "Depends on B",
        "dynamic_field_config": {},
        "field_schema": {
          "additionalProperties": {},
          "properties": { "field1": null, "field2": null },
          "required": ["field1"],
          "type": "object"
        },
        "id": "formF",
        "is_reusable": true,
        "name": "Form F",
        "ui_schema": { "elements": [], "type": "object" },
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "nodes": [
      { "id": "formA", "data": { "component_id": "formA" } },
      { "id": "formB", "data": { "component_id": "formB" } },
      { "id": "formC", "data": { "component_id": "formC" } },
      { "id": "formD", "data": { "component_id": "formD" } },
      { "id": "formE", "data": { "component_id": "formE" } },
      { "id": "formF", "data": { "component_id": "formF" } }
    ],
    "promoted_data_order": [
      "string"
    ],
    "status": "draft",
    "tenant_id": "t_67890",
    "triggers": [
      {
        "$schema": "https://example.com/schemas/TriggerEndpointDescription.json",
        "created_at": "2021-01-01T00:00:00Z",
        "id": "te_213j32",
        "max_retries": 3,
        "name": "Send Email",
        "output_mapping": {
          "id": ".data.value.id"
        },
        "path_template": "/api/v1/customer/{{.customer_id}}/do/something/",
        "path_template_variables": [
          "customer_id"
        ],
        "payload_template": {
          "subject": "{{.subject}}",
          "to": "{{.to}}"
        },
        "payload_template_variables": [
          "to",
          "subject"
        ],
        "query_parameter_template": {
          "user_id": "{{.user_id}}"
        },
        "query_parameter_template_variables": [
          "user_id"
        ],
        "request_method": "POST",
        "timeout_seconds": 10,
        "trigger_service_id": "ts_213j32",
        "updated_at": "2021-01-01T00:00:00Z"
      }
    ],
    "version_id": "bpv_123",
    "version_notes": "Initial draft",
    "version_number": "v1.0.0"
  });
};
