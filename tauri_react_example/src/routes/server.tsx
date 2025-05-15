import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/server")({
  component: Server,
});

function Server() {
  return <div className="p-2">Server management page</div>;
}
