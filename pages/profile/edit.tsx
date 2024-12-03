import type { NextPage } from "next";
import Layout from "../components/layout";
import Input from "../components/input";
import Button from "../components/button";
import useUser from "../libs/client/useUser";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import useMutation from "../libs/client/useMutation";
import { useRouter } from "next/router";

interface EditProfileForm {
  email?: string;
  phone?: string;
  name?: string;
  formErrors?: string;
}
interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

const EditProfile: NextPage = () => {
  const { user } = useUser();
  const {
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EditProfileForm>();

  // user가 변경될 때마다 실행되도록, 자동으로 form에 들어갈 값 채우기
  useEffect(() => {
    if (user?.name) setValue("name", user.name);
    if (user?.email) setValue("email", user?.email);
    if (user?.phone) setValue("phone", user?.phone);
  }, [user, setValue]);

  // POST요청하기
  const [editProfile, { data, loading }] =
    useMutation<EditProfileResponse>(`/api/users/me`);

  // 프로필 편집 로직
  const onValid = ({ email, phone, name }: EditProfileForm) => {
    // console.log({ email, phone });

    //여러번 클릭시 에러 안나도록 방지
    if (loading) return;

    //email, phone 둘다 비어있으면 안됨
    if (email === "" && phone === "" && name === "") {
      return setError("root.empty", {
        message: "You must provide at least one field",
      });
    }
    /*else {
      console.log("update profile 001");
    }*/
    /* if (email === "" && phone === "") {
      setError("formErrors", {
        message: "Email OR Phone number are required. You need to choose one.",
      });
    } setError를 통해서 errors를 생성하고 난 이후부터는 handlerSubmit에서 onValid가 실행하지 못하는 이슈*/

    editProfile({ email, phone, name });
  };

  // 에러메세지
  useEffect(() => {
    if (data && !data.ok && data.error) {
      setError("root.empty", { message: data.error });
    }
  }, [data, setError]);

  // 프로필 편집 후 페이지 이동
  const router = useRouter();
  useEffect(() => {
    if (data?.ok === true) {
      router.push(`/profile`);
    }
  }, [data, router]);

  return (
    <Layout canGoBack title="Edit Profile">
      <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-full bg-slate-500" />
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change
            <input
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input
          register={register("name")}
          required={false}
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("email")}
          required={false}
          label="Email address"
          name="email"
          type="email"
        />
        <Input
          register={register("phone")}
          required={false}
          label="Phone number"
          name="phone"
          type="number"
          kind="phone"
        />
        {errors.root?.empty ? (
          <span className="my-2 text-red-500 font-medium text-center block">
            {errors.root.empty.message}
          </span>
        ) : null}
        {/* {errors.formErrors ? (
          <span className="my-2 text-red-500 font-medium text-center block">
            {errors.formErrors.message}
          </span>
        ) : null} */}
        <Button text={loading ? "Loading..." : "Update profile"} />
      </form>
    </Layout>
  );
};
export default EditProfile;
