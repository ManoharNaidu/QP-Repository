import React, { useEffect, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

const Layout = () => {
  const shape1Ref = useRef(null);
  const shape2Ref = useRef(null);
  const shape3Ref = useRef(null);

  useEffect(() => {
    // Smooth animations for floating shapes
    const animateShape = (shape) => {
      gsap.to(shape, {
        y: "+=20",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    };

    animateShape(shape1Ref.current);
    animateShape(shape2Ref.current);
    animateShape(shape3Ref.current);

    // Make shapes draggable
    const createDraggable = (shape) => {
      Draggable.create(shape, {
        type: "x,y",
        edgeResistance: 0.65,
        bounds: "body",
        inertia: true,
        onDrag: () => {
          gsap.killTweensOf(shape);
        },
        onDragEnd: () => {
          animateShape(shape);
        },
      });
    };

    createDraggable(shape1Ref.current);
    createDraggable(shape2Ref.current);
    createDraggable(shape3Ref.current);

    // Add click event listener to change size
    const handleClick = (shape) => {
      gsap.to(shape, {
        width: "+=20",
        height: "+=20",
        duration: 0.5,
        ease: "power2.inOut",
      });
    };

    const shape1 = shape1Ref.current;
    const shape2 = shape2Ref.current;
    const shape3 = shape3Ref.current;

    shape1.addEventListener("click", () => handleClick(shape1));
    shape2.addEventListener("click", () => handleClick(shape2));
    shape3.addEventListener("click", () => handleClick(shape3));

    // Cleanup event listeners on unmount
    return () => {
      shape1.removeEventListener("click", () => handleClick(shape1));
      shape2.removeEventListener("click", () => handleClick(shape2));
      shape3.removeEventListener("click", () => handleClick(shape3));
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative bg-gradient-to-br from-blue-300 via-blue-200 to-blue-500">
      {/* Floating Shapes for Theme */}
      <div
        ref={shape1Ref}
        className="shape absolute bg-white opacity-40 rounded-full w-32 h-32 top-10 left-20"
      ></div>
      <div
        ref={shape2Ref}
        className="shape absolute bg-white opacity-40 rounded-full w-48 h-48 bottom-20 right-20"
      ></div>
      <div
        ref={shape3Ref}
        className="shape absolute bg-white opacity-20 rounded-lg w-40 h-40 top-40 right-32"
      ></div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center items-center">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
