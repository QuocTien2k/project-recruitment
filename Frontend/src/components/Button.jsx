import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "default",
  size = "md",
  disabled = false,
  className = "",
}) => {
  // Kích thước
  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  // Màu sắc theo variant
  const variantClasses = {
    default: "bg-green-500 text-white hover:bg-green-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  // Trạng thái disabled
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`rounded transition duration-200 ${sizeClasses[size] || ""} ${
        variantClasses[variant] || variantClasses["default"]
      } ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
