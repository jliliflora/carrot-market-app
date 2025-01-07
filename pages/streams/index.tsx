import type { NextPage } from "next";
import Layout from "../components/layout";
import FloatingButton from "../components/floating-button";
import Link from "next/link";
import { Stream } from "@prisma/client";
import useSWR from "swr";
import { useEffect, useState } from "react";
import Pagination from "../components/pagination";
import useUser from "../libs/client/useUser";
import DemoAlert from "../components/demoalert";

interface StreamsResponse {
  ok: boolean;
  streams: Stream[];
}

const Streams: NextPage = () => {
  //로그인이 안됐을때 enter로 redirect
  const {} = useUser();
  // console.log(user);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState<Number>();

  const { data } = useSWR<StreamsResponse>(`/api/streams`);
  const { data: limitData } = useSWR<StreamsResponse>(
    `/api/streams?page=${currentPage}`
  );

  useEffect(() => {
    setTotalCount(data?.streams?.length!);
  }, [data]);

  return (
    <Layout hasTabBar title="라이브">
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

        <FloatingButton href="/streams/create">
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
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Streams;
