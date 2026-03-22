import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { ThemeProvider } from "../context/ThemeContext";

const Layout = () => {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen relative">
        <Navbar />
        {/* pt-16 md:pt-20 to offset the fixed navbar height */}
        <main className="flex-grow flex flex-col pt-16 md:pt-20">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
