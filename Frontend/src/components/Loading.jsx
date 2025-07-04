const Loading = ({ size = "md" }) => {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div
        className={`loading-spinner mx-auto ${sizeMap[size] || sizeMap["md"]}`}
      ></div>
    </div>
  );
};

export default Loading;
