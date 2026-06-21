import { HTMLAttributes } from "react";
import clsx from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg";
}

export function Card({ padding = "md", className, children, ...props }: CardProps) {
  const paddings = { sm: "p-4", md: "p-6", lg: "p-8" };
  return (
    <div
      className={clsx(
        "bg-white rounded-2xl border border-slate-200 shadow-sm",
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("mb-4", className)} {...props}>
      {children}
    </div>
  );
}
