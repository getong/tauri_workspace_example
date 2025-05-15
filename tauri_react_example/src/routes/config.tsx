import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/config")({
  component: Config,
});

function Config() {
  return <div className="p-2">Welcome to the Configuration page!</div>;
}
