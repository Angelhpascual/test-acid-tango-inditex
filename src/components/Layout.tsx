import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="flex-1 h-full w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
