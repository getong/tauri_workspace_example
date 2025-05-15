import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>{" "}
        <Link to="/data" className="[&.active]:font-bold">
          Data
        </Link>{" "}
        <Link to="/charts" className="[&.active]:font-bold">
          Charts
        </Link>{" "}
        <Link to="/config" className="[&.active]:font-bold">
          Config
        </Link>{" "}
        <Link to="/server" className="[&.active]:font-bold">
          Server
        </Link>
      </div>
      <hr />
      <Outlet />
    </>
  ),
});
