import type { NextPage } from "next";
import Layout from "../components/layout";
import Link from "next/link";
import { Stream } from "@prisma/client";
import useSWR from "swr";
import { useEffect, useState } from "react";
import Pagination from "../components/pagination";
import useUser from "../../src/libs/client/useUser";
import DemoAlert from "../components/demoalert";
import Head from "next/head";
import Loader from "../components/loadingspin";

interface StreamsResponse {
  ok: boolean;
  streams: Stream[];
}

const Streams: NextPage = () => {
  //로그인이 안됐을때 enter로 redirect
  const {} = useUser();
  // console.log(user);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number>();

  const { data } = useSWR<StreamsResponse>(`/api/streams`);
  const { data: limitData, isLoading: limitLoading } = useSWR<StreamsResponse>(
    `/api/streams?page=${currentPage}`
  );

  useEffect(() => {
    // setTotalCount(data?.streams?.length!); => 옵셔널 체이닝 (?.)과 널이 아니라고 강제하는 단언 연산자 (!)를 동시에 사용하여 에러 발생
    setTotalCount(data?.streams?.length ?? 0); // length가 undefined일 경우 0을 기본값으로 사용
  }, [data]);

  return (
    <Layout hasTabBar title="라이브">
      <Head>
        <title>라이브</title>
      </Head>

      {limitLoading ? (
        <div className="flex flex-col items-center justify-center h-screen -translate-y-12">
          <Loader />
        </div>
      ) : (
        <div className="mb-5 divide-y-[1px] space-y-4">
          {limitData?.streams?.map((stream) => (
            <Link
              key={stream.id}
              href={`/streams/${stream.id}`}
              className="pt-4 block  px-4"
            >
              <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
              {/* <h3 className="mt-2 text-lg  text-gray-700">{stream.id}</h3> */}
              <h1 className="text-2xl mt-2 font-bold text-gray-900">
                {stream.name}
              </h1>
            </Link>
          ))}
          <DemoAlert />

          {/* {[1, 1, 1, 1, 1, 1, 1].map((_, i) => (
          <div className="pt-4  px-4" key={i}>
            <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
            <h1 className="text-2xl mt-2 font-bold text-gray-900">
              Galaxy S50
            </h1>
          </div>
        ))} */}
          <Pagination
            totalCount={Number(totalCount)}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          <div className="fixed hover:bg-orange-500 border-0 aspect-square border-transparent transition-colors cursor-pointer  bottom-24 right-5 shadow-xl bg-orange-400 rounded-full w-14 flex items-center justify-center text-white">
            <Link href="/streams/create">
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
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                ></path>
              </svg>
            </Link>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Streams;
