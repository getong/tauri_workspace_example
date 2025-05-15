import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/data")({
  component: Data,
});

function Data() {
  return <div className="p-2">This is the Data page!</div>;
}
