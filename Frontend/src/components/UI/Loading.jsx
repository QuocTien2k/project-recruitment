// const Loading = ({ size = "md" }) => {
//   const sizeMap = {
//     sm: "w-4 h-4",
//     md: "w-8 h-8",
//     lg: "w-12 h-12",
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <div
//         className={`loading-spinner mx-auto ${sizeMap[size] || sizeMap["md"]}`}
//       ></div>
//     </div>
//   );
// };

// export default Loading;
const Loading = ({ size = "md" }) => {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen space-y-3">
      <svg
        aria-label="Loading..."
        role="status"
        viewBox="0 0 256 256"
        className={`animate-spin stroke-gray-500 ${
          sizeMap[size] || sizeMap["md"]
        }`}
      >
        <line
          x1="128"
          y1="32"
          x2="128"
          y2="64"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        />
        <line
          x1="195.9"
          y1="60.1"
          x2="173.3"
          y2="82.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        />
        <line
          x1="224"
          y1="128"
          x2="192"
          y2="128"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        />
        <line
          x1="195.9"
          y1="195.9"
          x2="173.3"
          y2="173.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        />
        <line
          x1="128"
          y1="224"
          x2="128"
          y2="192"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        />
        <line
          x1="60.1"
          y1="195.9"
          x2="82.7"
          y2="173.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        />
        <line
          x1="32"
          y1="128"
          x2="64"
          y2="128"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        />
        <line
          x1="60.1"
          y1="60.1"
          x2="82.7"
          y2="82.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        />
      </svg>

      <span className="text-xl font-medium text-gray-500">Loading...</span>
    </div>
  );
};

export default Loading;
