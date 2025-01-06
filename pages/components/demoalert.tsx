import React, { useState } from "react";

export default function DemoAlert() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false); // 완전히 사라지게 설정
    }, 300); // 0.3초 후에 실제로 숨김
  };

  return (
    <>
      {isVisible && (
        // <div className="divide-y-0">
        <div
          className={`divide-y-0 transition-opacity duration-300 ${
            isFadingOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <p className="fixed top-[calc(50%-3rem)] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-200 bg-opacity-60 border border-orange-300 rounded-xl px-4 py-2 w-[300px] text-center text-orange-500">
            <button
              onClick={handleClose}
              className="absolute top-[5px] right-[8px] text-sm"
            >
              ❌
            </button>
            이 페이지는 데모용으로 제공됩니다.
            <br /> 프리뷰를 통해 미리 둘러보고 가세요! 🚧
          </p>
        </div>
      )}
    </>
  );
}
