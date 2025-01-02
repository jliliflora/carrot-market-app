import type { NextPage } from "next";
import Layout from "../components/layout";
import FloatingButton from "../components/floating-button";
import Link from "next/link";
import useSWR from "swr";
import { Post, User } from "@prisma/client";
import { format } from "date-fns";
import useCoords from "../libs/client/useCoords";
import { useEffect, useState } from "react";
import Pagination from "../components/pagination";
import useUser from "../libs/client/useUser";

interface PostWithUser extends Post {
  user: User;
  _count: {
    wondering: number;
    answers: number;
  };
}

interface PostsResponse {
  ok: boolean;
  posts: PostWithUser[];
}

const Community: NextPage = () => {
  //로그인이 안됐을때 enter로 redirect
  const { user } = useUser();
  // console.log(user);

  // 현재 유저의 위치 좌표 구하는 코드
  const { longitude, latitude } = useCoords();
  // console.log(longitude, latitude);
  const Loading = longitude == null && latitude == null;
  // console.log(Loading);

  const { data } = useSWR<PostsResponse>(
    latitude && longitude
      ? `/api/posts?latitude=${latitude}&longitude=${longitude}`
      : null
  );
  // console.log(data);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState<Number>();
  const { data: limitData } = useSWR<PostsResponse>(
    latitude && longitude
      ? `/api/posts?latitude=${latitude}&longitude=${longitude}&page=${currentPage}`
      : null
  );
  useEffect(() => {
    setTotalCount(data?.posts?.length!);
  }, [data]);

  return (
    <Layout hasTabBar title="동네생활">
      {Loading ? (
        <div className="pt-6 text-center">Loading...</div>
      ) : !limitData?.posts?.length ? (
        <div className="pt-12 text-center">
          아직 아무도 소식을 남기지 않았어요. <br /> 첫 번째 소식을 들려주시면
          모두가 기다릴 거예요! 😊
          <FloatingButton href="/community/write">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              ></path>
            </svg>
          </FloatingButton>
        </div>
      ) : (
        <div className="pt-6 space-y-8">
          {limitData?.posts.map((post) => (
            <Link
              key={post.id}
              href={`/community/${post.id}`}
              className="flex cursor-pointer flex-col pt-4 items-start"
            >
              <span className="flex ml-4 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                동네질문
              </span>
              <div className="mt-2 px-4 text-gray-700">
                <span className="text-orange-500 font-medium">Q.</span>
                {post.question}
              </div>
              <div className="mt-5 px-4 flex items-center justify-between w-full text-gray-500 font-medium text-xs">
                <span>{post.user.name}</span>
                <span>{format(post.createdAt, "yyyy-MM-dd HH:mm:ss")}</span>
              </div>
              <div className="flex px-4 space-x-5 mt-3 text-gray-700 py-2.5 border-t border-b-[2px]  w-full">
                <span className="flex space-x-2 items-center text-sm">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>궁금해요 {post._count.wondering}</span>
                </span>
                <span className="flex space-x-2 items-center text-sm">
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    ></path>
                  </svg>
                  <span>답변 {post._count.answers}</span>
                </span>
              </div>
            </Link>
          ))}

          <Pagination
            totalCount={Number(totalCount)}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />

          {/* {[1, 2, 3, 4, 5, 6].map((_, i) => (
          <div className="flex cursor-pointer flex-col items-start">
            <span className="flex ml-4 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              동네질문
            </span>
            <div className="mt-2 px-4 text-gray-700">
              <span className="text-orange-500 font-medium">Q.</span> What is
              the best mandu restaurant?
            </div>
            <div className="mt-5 px-4 flex items-center justify-between w-full text-gray-500 font-medium text-xs">
              <span>니꼬</span>
              <span>18시간 전</span>
            </div>
            <div className="flex px-4 space-x-5 mt-3 text-gray-700 py-2.5 border-t border-b-[2px]  w-full">
              <span className="flex space-x-2 items-center text-sm">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>궁금해요 1</span>
              </span>
              <span className="flex space-x-2 items-center text-sm">
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  ></path>
                </svg>
                <span>답변 1</span>
              </span>
            </div>
          </div>
        ))} */}

          {/* <button className="fixed hover:bg-orange-500 transition-colors cursor-pointer  bottom-24 right-5 shadow-xl bg-orange-400 rounded-full p-4 text-white"> */}
          <FloatingButton href="/community/write">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              ></path>
            </svg>
          </FloatingButton>
        </div>
      )}
    </Layout>
  );
};
export default Community;
