import { Label } from "@radix-ui/react-label";
import React from "react";

interface LabelsProps {
  text: string;
  htmlFor: string;
  className: string;
}

const Labels = ({ text, htmlFor, className }: LabelsProps) => {
  return (
    <div>
      <Label htmlFor={htmlFor} className={className}>
        {text}
      </Label>
    </div>
  );
};

export default Labels;
