import type { NextPage } from "next";
import Layout from "../components/layout";
import TextArea from "../components/textarea";
import Button from "../components/button";
import { useForm } from "react-hook-form";
import useMutation from "../../src/libs/client/useMutation";
import { Post } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useCoords from "../../src/libs/client/useCoords";
import useUser from "../../src/libs/client/useUser";

interface WriteForm {
  question: string;
}
interface WriteResponse {
  ok: boolean;
  post: Post;
  latitude: number | null;
  longitude: number | null;
}
interface WriteRequest {
  question: string;
  latitude: number | null;
  longitude: number | null;
}

const Write: NextPage = () => {
  //로그인이 안됐을때 enter로 redirect
  const {} = useUser();
  // console.log(user);

  //위치 받는 hook
  const { latitude, longitude } = useCoords();
  const { register, handleSubmit } = useForm<WriteForm>();
  const [post, { loading, data }] = useMutation<WriteRequest, WriteResponse>(
    "/api/posts"
  );
  const onValid = (data: WriteForm) => {
    // console.log(data);
    if (loading) return; //data가 여러번 post 되지 않도록 리턴시키기
    post({ ...data, latitude, longitude });

    /*
    post({
      ...data,
      latitude,
      longitude,
      ok: true, // API 호출 후 성공 상태를 나타내는 값
      post: {
        id: 0, // 임시 id (후에 실제 값으로 바꿀 것)
        question: data.question,
        createdAt: new Date(), // 임시 createdAt (후에 실제 값으로 바꿀 것)
        updatedAt: new Date(), // 임시 updatedAt (후에 실제 값으로 바꿀 것)
        userId: 1, // 임시 userId (후에 실제 값으로 바꿀 것)
        latitude: latitude ?? null,
        longitude: longitude ?? null,
      },
    });
    */
  };

  const router = useRouter();
  useEffect(() => {
    if (data && data.ok) {
      router.push(`/community/${data.post.id}`);
    }
  }, [data, router]);

  return (
    <Layout canGoBack title="Write Post">
      <form onSubmit={handleSubmit(onValid)} className="p-4 space-y-4">
        <TextArea
          register={register("question", { required: true, minLength: 5 })}
          required
          placeholder="Ask a question!"
        />
        <Button text={loading ? "Loading..." : "Submit"} />
      </form>
    </Layout>
    // <form className="px-4 py-10">
    //   <textarea
    //     className="mt-1 shadow-sm w-full focus:ring-orange-500 rounded-md border-gray-300 focus:border-orange-500 "
    //     rows={4}
    //     placeholder="Ask a question!"
    //   />
    //   <button className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none ">
    //     Submit
    //   </button>
    // </form>
  );
};
export default Write;
