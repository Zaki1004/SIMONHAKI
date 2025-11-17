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
}

const Buttons = ({ onClick, className, variant, children }: ButtonsProps) => {
  return (
    <Button onClick={onClick} className={className} variant={variant}>
      {children}
    </Button>
  );
};

export default Buttons;
