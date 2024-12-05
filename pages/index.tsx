import Image from "next/image";
import localFont from "next/font/local";
import Layout from "./components/layout";
import FloatingButton from "./components/floating-button";
import Item from "./components/item";
import useUser from "./libs/client/useUser";
import Head from "next/head";
import useSWR from "swr";
import { Product } from "@prisma/client";

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

export default function Home() {
  const { user, isLoading } = useUser(); //페이지에 데이터를 전달해주는 훅
  // console.log(user);

  const { data } = useSWR<ProductsResponse>("api/products");
  // console.log(data);

  return (
    <Layout title="홈" hasTabBar>
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex flex-col space-y-5 pt-5">
        {data?.products?.map((product) => (
          <Item
            id={product.id}
            key={product.id}
            title={product.name}
            price={product.price}
            hearts={product._count.favs}
          ></Item>
        ))}

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
