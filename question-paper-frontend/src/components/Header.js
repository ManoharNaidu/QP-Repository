import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import pkg from "../../package.json";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", color: "text-blue-400 hover:text-blue-300" },
    {
      path: "/upload",
      label: "Upload",
      color: "text-green-400 hover:text-green-300",
    },
    {
      path: "/download",
      label: "Search",
      color: "text-red-400 hover:text-red-300",
    },
    {
      path: "/feedback",
      label: "Feedback",
      color: "text-purple-400 hover:text-purple-300",
    },
  ];

  return (
    <header className="bg-gray-900 text-gray-200 py-4 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <h1 className="text-2xl font-extrabold flex items-center gap-3">
          <img
            src="/logo.png"
            alt="QP Repository Logo"
            className="w-8 h-8 object-contain"
          />
          <Link to="/" className="hover:text-blue-300">
            <div className="flex flex-col">
              <span>QP Repository</span>
              <small className="text-xs text-gray-400">v{pkg.version}</small>
            </div>
          </Link>
        </h1>
        <nav className="hidden md:flex">
          <ul className="flex gap-4 text-lg font-semibold">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    item.color,
                    "transition-all",
                    location.pathname === item.path
                      ? "underline"
                      : "no-underline"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <nav className="flex md:hidden justify-around mt-4">
        <ul className="flex gap-4 text-lg font-semibold">
          {navItems.slice(1).map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  item.color,
                  "transition-all",
                  location.pathname === item.path ? "underline" : "no-underline"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
