const InputField = ({
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  className = "",
  ...props
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border border-gray-300 rounded px-3 py-2 shadow-sm ${className}`}
      {...props}
    />
  );
};

export default InputField;
