import React from "react";

export default function JsonSchemaViewer() {
  const schema = { type: "object", properties: { name: { type: "string" } } };
  return <pre>{JSON.stringify(schema, null, 2)}</pre>;
}