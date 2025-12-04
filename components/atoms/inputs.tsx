import React from "react";
import { Input } from "../ui/input";

interface InputsProps {
  placeholder: string;
  type: string;
  className: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  value?: string;
}

const Inputs = ({
  placeholder,
  type,
  className,
  onChange,
  onKeyDown,
  value,
}: InputsProps) => {
  return (
    <Input
      placeholder={placeholder}
      type={type}
      className={className}
      onChange={onChange}
      onKeyDown={onKeyDown}
      value={value}
    />
  );
};

export default Inputs;
