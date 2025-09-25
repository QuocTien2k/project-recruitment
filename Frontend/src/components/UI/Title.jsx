import React from "react";

const Title = ({
  text,
  size = "xl",
  align = "left",
  underline = false,
  className = "",
}) => {
  // Cỡ chữ
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl font-bold",
    "2xl": "text-2xl font-bold",
  };

  // 📌 Canh lề
  const alignClass =
    align === "center"
      ? "text-center"
      : align === "right"
      ? "text-right"
      : "text-left";

  // 📌 Gạch chân
  const underlineClass = underline
    ? "underline underline-offset-4 decoration-2"
    : "";

  // 👉 Kết hợp class
  const classes = `
    text-black 
    drop-shadow-md 
    
    ${sizeClasses[size]} 
    ${alignClass} 
    ${underlineClass} 
    ${className}
  `;

  return <h2 className={classes}>{text}</h2>;
};

export default Title;
