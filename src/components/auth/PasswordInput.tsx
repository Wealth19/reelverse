"use client";

import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ placeholder = "Password", className = "", ...props }, ref) => {
    const [show, setShow] = useState(false);

    return (
      <div style={{ position: "relative" }}>
        <input
          ref={ref}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className={`pi-input ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="pi-toggle"
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>

        <style>{`
          .pi-input {
            width: 100%;
            height: 48px;
            padding: 0 46px 0 14px;
            border-radius: 10px;
            border: 1.5px solid #2a241c;
            background: #141118;
            color: #fff;
            font-size: 0.92rem;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
            font-family: inherit;
            box-sizing: border-box;
          }
          .pi-input::placeholder { color: #4a4050; }
          .pi-input:focus {
            border-color: #d4a24c;
            box-shadow: 0 0 0 3px rgba(212,162,76,0.12);
          }
          .pi-toggle {
            position: absolute;
            right: 13px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            padding: 0;
            color: #6b6070;
            cursor: pointer;
            display: flex;
            align-items: center;
            transition: color 0.2s;
          }
          .pi-toggle:hover { color: #cbbba4; }
        `}</style>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
