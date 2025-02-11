import React from "react";
import {Alert} from "@nextui-org/react";
import { cn } from "@nextui-org/react";

interface CustomAlertProps {
  title: string;
  children: React.ReactNode;
  variant?: "faded" | "filled" | "light";
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  className?: string;
  classNames?: {
    base?: string;
    mainWrapper?: string;
    iconWrapper?: string;
  };
}

export const CustomAlert = React.forwardRef(
  (
    {title, children, variant = "faded", color = "secondary", className, classNames = {}, ...props}: CustomAlertProps,
    ref,
  ) => {
    const colorClass = React.useMemo(() => {
      switch (color) {
        case "default":
          return "before:bg-default-300";
        case "primary":
          return "before:bg-primary";
        case "secondary":
          return "before:bg-secondary";
        case "success":
          return "before:bg-success";
        case "warning":
          return "before:bg-warning";
        case "danger":
          return "before:bg-danger";
        default:
          return "before:bg-default-200";
      }
    }, []);

    return (
      <Alert
        ref={ref}
        classNames={{
          ...classNames,
          base: cn(
            [
              "relative before:content-[''] before:absolute before:z-10",
              "before:left-0 before:top-[-1px] before:bottom-[-1px] before:w-1",
              "rounded-l-none border-l-0",
              {
                'bg-default-50 dark:bg-default-100': color === 'default',
                'bg-primary-50 dark:bg-primary-900/20': color === 'primary',
                'bg-secondary-50 dark:bg-secondary-900/20': color === 'secondary',
                'bg-success-50 dark:bg-success-900/20': color === 'success',
                'bg-warning-50 dark:bg-warning-900/20': color === 'warning',
                'bg-danger-50 dark:bg-danger-900/20': color === 'danger',
              },
              "border-1 border-default-200 dark:border-default-100",
              colorClass,
            ],
            classNames.base,
            className,
          ),
          mainWrapper: cn("pt-1", classNames.mainWrapper),
          iconWrapper: cn("dark:bg-transparent", classNames.iconWrapper),
        }}
        color={color}
        title={title}
        variant={variant}
        {...props}
      >
        {children}
      </Alert>
    );
  },
);

CustomAlert.displayName = "CustomAlert";