import React from "react";

import { cn } from "../../lib/utils";

const variantClasses = {
  rectangle: "rounded-lg",
  circle: "rounded-full",
  text: "rounded-full",
};

const Skeleton = React.forwardRef(
  (
    { className, variant = "rectangle", as: Component = "div", ...props },
    ref,
  ) => (
    <Component
      ref={ref}
      aria-hidden="true"
      className={cn(
        "skeleton bg-surface-container-high/80",
        variantClasses[variant] ?? variantClasses.rectangle,
        className,
      )}
      {...props}
    />
  ),
);

Skeleton.displayName = "Skeleton";

export default Skeleton;
