"use client";
import * as lucideIcons from "lucide-react";
import { twMerge } from "tailwind-merge";

export const { icons } = lucideIcons;

interface LucideProps extends React.ComponentPropsWithoutRef<"svg"> {
  icon: keyof typeof icons;// Corrected to string based on your usage
  title?: string;
  className?: string; // Added to specify className is optional
}

function Lucide({ icon, className, ...computedProps }: LucideProps) {
  const Component = icons[icon]; // Access icon from icons object
  if (!Component) return null; // Handle case where icon is not found

  return (
    <Component
      {...computedProps}
      className={twMerge(["stroke-[1] w-5 h-5", className])}
    />
  );
}

export default Lucide;
