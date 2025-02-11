import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen ">
      <Outlet />
    </div>
  );
};

export default Layout;
