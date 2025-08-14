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
      className={`w-[40%] border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none ${className}`}
      {...props}
    />
  );
};

export default InputField;
