import type { NextPage } from "next";
import Layout from "../components/layout";
import Input from "../components/input";
import TextArea from "../components/textarea";
import Button from "../components/button";
import { useForm } from "react-hook-form";
import useMutation from "../../src/libs/client/useMutation";
import { useEffect } from "react";
import { Product } from "@prisma/client";
import { useRouter } from "next/router";
import useUser from "../../src/libs/client/useUser";
import Head from "next/head";

interface UploadProductForm {
  name: string;
  price: number;
  description: string;
}
interface UploadProductMutation {
  ok: boolean;
  product: Product;
}

const Upload: NextPage = () => {
  //로그인이 안됐을때 enter로 redirect
  const {} = useUser();
  // console.log(user);

  const { register, handleSubmit } = useForm<UploadProductForm>();

  const [uploadProduct, { loading, data }] = useMutation<
    UploadProductForm,
    UploadProductMutation
  >("/api/products");

  const onValid = (data: UploadProductForm) => {
    if (loading) return;
    uploadProduct(data); //현재 코드에서 문제가 발생하는 이유는 UploadProductForm이 UploadProductMutation의 구조와 일치하지 않기 때문, 그러나 코드가 작동하는 이유는 타입 추론이 자동으로 처리되고 있음
    // console.log(data);
  };

  const router = useRouter();
  //data가 변경될때마다 실행시키고, data.ok가 참이면 product의 id로 redirect를 함
  useEffect(() => {
    if (data?.ok) {
      router.push(`/products/${data.product.id}?from=upload`);
    }
  }, [data, router]);

  return (
    <Layout canGoBack title="Upload Product">
      <Head>
        <title>Home</title>
      </Head>
      <form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)}>
        <div>
          <label className="w-full cursor-pointer text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
            <svg
              className="h-12 w-12"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input className="hidden" type="file" />
          </label>
        </div>
        <Input
          register={register("name", { required: true })}
          required
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("price", { required: true })}
          required
          label="Price"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register("description", { required: true })}
          required
          name="description"
          label="Description"
        />
        <Button text={loading ? "Loading..." : "Upload item"} />
      </form>

      {/* <div className="px-4 space-y-5 py-10">
        <div>
          <div>
            <label className="w-full cursor-pointer text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
              <svg
                className="h-12 w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input className="hidden" type="file" />
            </label>
          </div>
        </div>
        <div>
          <label
            className="mb-1 block text-sm font-medium text-gray-700"
            htmlFor="name"
          >
            Name
          </label>
          <div className="rounded-md relative flex  items-center shadow-sm">
            <input
              id="name"
              type="email"
              className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
        </div>
        <div className="my-5">
          <label
            className="mb-1 block text-sm font-medium text-gray-700"
            htmlFor="price"
          >
            Price
          </label>
          <div className="rounded-md relative flex  items-center shadow-sm">
            <div className="absolute left-0 pointer-events-none pl-3 flex items-center justify-center">
              <span className="text-gray-500 text-sm">$</span>
            </div>
            <input
              id="price"
              className="appearance-none pl-7 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              type="text"
              placeholder="0.00"
            />
            <div className="absolute right-0 pointer-events-none pr-3 flex items-center">
              <span className="text-gray-500">USD</span>
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <div>
            <textarea
              id="description"
              className="mt-1 shadow-sm w-full focus:ring-orange-500 rounded-md border-gray-300 focus:border-orange-500 "
              rows={4}
            />
          </div>
        </div>
        <button className=" w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none ">
          Upload item
        </button>
      </div> */}
    </Layout>
  );
};
export default Upload;
