import { cls } from "../../src/libs/client/utils";
import React from "react";

interface PaginationProps {
  totalCount: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>; // 현재 페이지를 업데이트하는 상태 관리 함수
}

const Pagination = ({
  totalCount,
  currentPage,
  setCurrentPage,
}: PaginationProps) => {
  const pageCount = 5; //페이지 그룹의 크기
  const totalPage = totalCount ? Math.ceil(totalCount / 10) : 0; // 전체 페이지 수
  const pageGroup = Math.ceil(currentPage / pageCount); // 현재 페이지가 속한 페이지 그룹 계산 : currentPage = 7이라면, 7 / 5 = 1.4 -> 올림 -> pageGroup = 2.
  let lastNum = pageGroup * 5; // 현재 페이지 그룹의 마지막 페이지 번호

  // 마지막 페이지 번호가 총 페이지 수를 넘지 않도록 조정
  if (lastNum > totalPage) lastNum = totalPage;

  // 현재 페이지 그룹의 첫번째 페이지 번호 + 첫번째 페이지 번호가 1보다 작아지는 것을 방지
  const firstNum = Math.max(1, lastNum - (pageCount - 1));

  // 이전 페이지 그룹으로 이동
  const prevPage = () => {
    setCurrentPage(firstNum - 1);
  };

  // 다음 페이지 그룹으로 이동
  const nextPage = () => {
    setCurrentPage(lastNum + 1);
  };

  // 특정 페이지로 이동 (버튼 클릭 시 호출)
  const movePage = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    setCurrentPage(+target.innerText);
  };

  // 데이터가 없거나(버그방지) + 페이지가 1개일 때는 UI 숨기기
  if (!totalCount || totalPage <= 1) {
    return null;
  }

  return (
    <div className="flex item-center justify-center space-x-2 py-5">
      {firstNum - 1 > 0 && (
        <button onClick={prevPage}>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
      )}
      {Array.from({ length: lastNum - firstNum + 1 }).map((_, i) => (
        <button
          key={i}
          onClick={movePage}
          className={cls(
            "rounded-full py-1 px-3",
            +currentPage === firstNum + i ? "bg-orange-100" : "cursor-pointer"
          )}
        >
          {firstNum + i}
        </button>
      ))}
      {lastNum < totalPage && (
        <button onClick={nextPage}>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>
      )}
    </div>
  );
};
export default Pagination;
