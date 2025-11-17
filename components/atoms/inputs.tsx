import React from "react";
import { Input } from "../ui/input";

interface InputsProps {
  placeholder: string;
  type: string;
  className: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Inputs = ({ placeholder, type, className, onChange }: InputsProps) => {
  return (
    <Input
      placeholder={placeholder}
      type={type}
      className={className}
      onChange={onChange}
    />
  );
};

export default Inputs;
