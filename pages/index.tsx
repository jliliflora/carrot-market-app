// import localFont from "next/font/local";
import Layout from "./components/layout";
// import FloatingButton from "./components/floating-button";
import Item from "./components/item";
import useUser from "../src/libs/client/useUser";
import Head from "next/head";
import useSWR from "swr";
import { Product } from "@prisma/client";
import { useEffect, useState } from "react";
import Pagination from "./components/pagination";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";

interface HomePageProps {
  mailId: string;
  mailPassword: string;
}

export const getServerSideProps: GetServerSideProps = async () => {
  // 환경 변수 가져오기
  const mailId = process.env.MAIL_ID || "";
  const mailPassword = process.env.MAIL_PASSWORD || "";

  if (!mailId || !mailPassword) {
    throw new Error("MAIL_ID and MAIL_PASSWORD must be defined");
  }

  // 페이지에 전달할 props
  return {
    props: {
      mailId,
      mailPassword,
    },
  };
};

const FloatingButton = dynamic(() => import("./components/floating-button"), {
  ssr: false, // 서버 사이드 렌더링을 하지 않도록 설정
});

/* 사용안해서 주석처리
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
*/

export interface ProductWithCount extends Product {
  _count: {
    favs: number;
  };
}

//타입스크립트가 'product'를 모르는 상태였는데 useSWR를 사용하면 데이터가 어떤 모습인지 알려줄 수 있기 때문에 인터페이스를 선언해주는것!
interface ProductsResponse {
  ok: boolean;
  products: ProductWithCount[];
}

export default function Home({ mailId, mailPassword }: HomePageProps) {
  // 페이지에서 받은 props 사용
  console.log("Mail ID:", mailId);
  console.log("Mail Password:", mailPassword);

  const {} = useUser(); //페이지에 데이터를 전달해주는 훅
  // console.log(user, isLoading);

  const { data } = useSWR<ProductsResponse>("api/products");
  // console.log(data);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number>(); // 대문자 Number는 객체 타입이고, 소문자 number는 원시 타입 => useState<number>()와 같이 원시 타입 number를 사용해야함!!
  const { data: limitData } = useSWR<ProductsResponse>(
    `/api/products?page=${currentPage}`
  );
  useEffect(() => {
    // setTotalCount(data?.products?.length!); => 옵셔널 체이닝 (?.)과 널이 아니라고 강제하는 단언 연산자 (!)를 동시에 사용하여 에러 발생
    setTotalCount(data?.products?.length ?? 0); // length가 undefined일 경우 0을 기본값으로 사용
  }, [data]);

  const imageUrls = [
    {
      id: 1,
      url: "/images/Tab.jpg",
    },
    {
      id: 2,
      url: "/images/S22.jpg",
    },
    {
      id: 3,
      url: "/images/iPhone15.jpg",
    },
    {
      id: 4,
      url: "/images/Max.jpg",
    },
  ];

  return (
    <Layout title="홈" hasTabBar>
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex flex-col space-y-5 pt-5">
        {limitData?.products?.map((product) => {
          const imageUrl =
            imageUrls.find((image) => image.id === product.id)?.url ||
            "/images/default.jpg";

          return (
            <Item
              id={product.id}
              key={product.id}
              title={product.name}
              price={product.price}
              hearts={product._count.favs}
              imageUrl={imageUrl}
            ></Item>
          );
        })}

        {/* {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, i) => (
          <div
            key={i}
            className="flex px-4 border-b pb-5 cursor-pointer justify-between"
          >
            <div className="flex space-x-4">
              <div className="w-20 h-20 bg-gray-400 rounded-md" />

              <div className="pt-2 flex flex-col">
                <h3 className="text-sm font-medium text-gray-900">
                  New iPhone 14
                </h3>
                <span className="text-xs text-gray-500">Black</span>
                <span className="font-medium mt-1 text-gray-900">$95</span>
              </div>
            </div>
            <div className="flex space-x-2 items-end justify-end">
              <div className="flex space-x-0.5 items-center text-sm  text-gray-600">
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
                <span>1</span>
              </div>
              <div className="flex space-x-0.5 items-center text-sm  text-gray-600">
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
                <span>1</span>
              </div>
            </div>
          </div>
        ))} */}

        {/* <button className="fixed hover:bg-orange-500 transition-colors cursor-pointer  bottom-24 right-5 shadow-xl bg-orange-400 rounded-full p-4 text-white"> */}
        <Pagination
          totalCount={Number(totalCount)}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
}
