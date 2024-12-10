import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { cls } from "../libs/client/utils";
import React from "react";

interface PaginationProps {
  totalCount: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination = ({
  totalCount,
  currentPage,
  setCurrentPage,
}: PaginationProps) => {
  const pageCount = 5;
  const totalPage = Math.ceil(totalCount / 20);
  const pageGroup = Math.ceil(currentPage / pageCount);
  let lastNum = pageGroup * 5;
  if (lastNum > totalPage) lastNum = totalPage;
  const firstNum = lastNum - (pageCount - 1);

  const prevPage = () => {
    setCurrentPage(firstNum - 1);
  };

  const nextPage = () => {
    setCurrentPage(lastNum + 1);
  };

  const movePage = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    setCurrentPage(+target.innerText);
  };

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
      {Array.from({ length: 5 }).map((_, i) => (
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
