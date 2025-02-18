import Header from "./Header";
import { Outlet } from "react-router-dom";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen relative bg-gray-800">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center items-center">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
