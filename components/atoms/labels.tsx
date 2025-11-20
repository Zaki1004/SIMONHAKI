import { Label } from "@radix-ui/react-label";
import React from "react";

interface LabelsProps {
  text?: string;
  htmlFor: string;
  className: string;
  children?: React.ReactNode;
}

const Labels = ({ text, htmlFor, className, children }: LabelsProps) => {
  return (
    <div>
      <Label htmlFor={htmlFor} className={className}>
        {children}
      </Label>
    </div>
  );
};

export default Labels;
