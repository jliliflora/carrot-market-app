import React from "react";

const Loader = () => {
  const loaderStyle: React.CSSProperties = {
    border: "5px solid #f3f3f3",
    borderTop: "5px solid #f97316",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
  };

  return (
    <div>
      <div style={loaderStyle}></div>
      <style>
        {`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
