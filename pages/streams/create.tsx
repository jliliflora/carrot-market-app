import type { NextPage } from "next";
import Layout from "../components/layout";
import Input from "../components/input";
import TextArea from "../components/textarea";
import Button from "../components/button";
import { Stream } from "@prisma/client";
import { useForm } from "react-hook-form";
import useMutation from "../libs/client/useMutation";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useUser from "../libs/client/useUser";

interface CreateForm {
  name: string;
  price: string;
  description: string;
}
interface CreateResponse {
  ok: boolean;
  stream: Stream;
}

const Create: NextPage = () => {
  //로그인이 안됐을때 enter로 redirect
  const {} = useUser();
  // console.log(user);

  const router = useRouter();
  const [createStream, { loading, data }] =
    useMutation<CreateResponse>(`/api/streams`);
  const { register, handleSubmit } = useForm<CreateForm>();
  const onValid = (form: CreateForm) => {
    console.log(form);
    if (loading) return;
    createStream(form);
  };

  useEffect(() => {
    //data를 받았고 data가 정상적인지 검사
    if (data && data.ok) {
      router.push(`/streams/${data.stream.id}`);
    }
  }, [data, router]);

  return (
    <Layout canGoBack title="Go Live">
      <form onSubmit={handleSubmit(onValid)} className=" space-y-4 py-10 px-4">
        <Input
          register={register("name", { required: true })}
          required
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("price", { required: true, valueAsNumber: true })}
          required
          label="Price"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register("description", { required: true })}
          name="description"
          label="Description"
        />

        <Button text={loading ? "Loading..." : "Go live"} />
      </form>
    </Layout>
  );
};
export default Create;
