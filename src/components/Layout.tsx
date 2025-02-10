import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-full w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
