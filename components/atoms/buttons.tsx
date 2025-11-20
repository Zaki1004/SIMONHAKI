import React from "react";
import { Button } from "../ui/button";

interface ButtonsProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className: string;
  variant:
    | "default"
    | "defaultSecond"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size: string | "sm" | "lg";
  children: React.ReactNode;
  disabled?: boolean;
}

const Buttons = ({
  onClick,
  className,
  variant,
  children,
  disabled = false,
}: ButtonsProps) => {
  return (
    <Button
      onClick={onClick}
      className={className}
      variant={variant}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export default Buttons;
