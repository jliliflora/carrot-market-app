import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { cls } from "../src/libs/client/utils";
import Input from "./components/input";
import Button from "./components/button";
import { useForm } from "react-hook-form";
import useMutation from "../src/libs/client/useMutation";
import { useRouter } from "next/router";
import Head from "next/head";
import Loader from "./components/loadingspin";

interface EnterForm {
  email?: string;
  phone?: string;
  ok: boolean; // 추가
}
interface MutationResult {
  ok: boolean;
  error?: string;
}
interface TokenForm {
  token: string;
  formErrors?: string;
  ok: boolean; // 추가
}

const Enter: NextPage = () => {
  const [enter, { loading, data }] = useMutation<EnterForm, MutationResult>(
    "/api/users/enter"
  );
  const [confirmToken, { loading: tokenLoading, data: tokenData }] =
    useMutation<TokenForm, MutationResult>("/api/users/confirm");

  const { register, handleSubmit, reset } = useForm<EnterForm>();
  const {
    register: tokenRegister,
    handleSubmit: tokenHandleSubmit,
    setError,
    formState: { errors },
  } = useForm<TokenForm>();

  const [method, setMethod] = useState<"email" | "phone">("email");
  const onEmailClick = () => {
    reset();
    setMethod("email");
  };
  /* 사용안해서 주석처리
  const onPhoneClick = () => {
    reset();
    setMethod("phone");
  }; */
  const onValid = (vaildForm: EnterForm) => {
    /*
    console.log(data);

    setSubmitting(true);
    fetch("/api/users/enter", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      }, //req.body.email을 받기 위해서 설정해줘야함
    }).then(() => {
      setSubmitting(false);
    });
    */

    if (loading) return; //이미 요청이 진행 중인 경우, 중복 요청을 방지하기 위해 함수를 중단하기 위한 장치!! loading이 true일 때, 즉, 요청이 아직 완료되지 않은 상태에서 사용자가 다시 onValid 함수를 실행하는 것을 막음
    enter(vaildForm);
  };
  const onTokenValid = (validForm: TokenForm) => {
    // console.log(validForm);
    if (tokenLoading) return;
    confirmToken(validForm);
  };

  const router = useRouter();
  useEffect(() => {
    // console.log("tokenData:", tokenData);
    if (tokenData?.ok) {
      router.push("/", undefined, { shallow: false }); //강제 새로고침
      // router.push("/?redirect=true"); => 캐시문제라면 이걸로 고치기
    }
  }, [tokenData, router]); //tokenData.ok가 참이면, 유저는 home으로 redirect하는 코드

  // 토큰 에러메세지
  useEffect(() => {
    if (tokenData && !tokenData.ok && tokenData.error) {
      setError("root.empty", { message: tokenData.error });
    }
  }, [tokenData, setError]);

  // console.log(watch());
  // console.log(loading, data, error); //브라우저 콘솔 출력

  return (
    <div className="mt-16 px-4">
      <Head>
        <title>Login</title>
      </Head>
      {(loading || tokenLoading) && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-50">
          <Loader />
        </div>
      )}
      <h3 className="text-3xl font-bold text-center">Enter to Carrot</h3>
      <div className="mt-11">
        {data?.ok ? (
          <>
            <div className="flex flex-col items-center">
              <h5 className="text-sm text-gray-500 font-medium">
                메일함을 확인하시고 발송된 인증 코드를 입력해 주세요!
              </h5>
            </div>
            <form
              onSubmit={tokenHandleSubmit(onTokenValid)}
              className="flex flex-col mt-8 space-y-4"
            >
              <Input
                register={tokenRegister("token", {
                  required: true,
                })}
                name="token"
                label="Confirmation Token"
                type="number"
                required
              />
              {errors.root?.empty ? (
                <span className="my-2 text-red-500 font-medium text-center block text-sm">
                  {errors.root.empty.message}
                </span>
              ) : null}
              <Button text={tokenLoading ? "Loading" : "Confirm Token"} />
            </form>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center">
              <h5 className="text-sm text-gray-500 font-medium">
                이메일을 입력해주세요!
              </h5>
              <div className="grid  border-b  w-full mt-8 ">
                <button
                  className={cls(
                    "pb-4 font-medium text-sm border-b-2",
                    method === "email"
                      ? " border-orange-500 text-orange-400"
                      : "border-transparent hover:text-gray-400 text-gray-500"
                  )}
                  onClick={onEmailClick}
                >
                  Email
                </button>
                {/* <button
                  className={cls(
                    "pb-4 font-medium text-sm border-b-2",
                    method === "phone"
                      ? " border-orange-500 text-orange-400"
                      : "border-transparent hover:text-gray-400 text-gray-500"
                  )}
                  onClick={onPhoneClick}
                >
                  Phone
                </button> */}
              </div>
            </div>
            <form
              onSubmit={handleSubmit(onValid)}
              className="flex flex-col mt-8 space-y-4"
            >
              {method === "email" ? (
                <Input
                  register={register("email", {
                    required: true,
                  })}
                  name="email"
                  label="Email address"
                  type="email"
                  required
                />
              ) : null}
              {/* {method === "phone" ? (
                <Input
                  register={register("phone")}
                  name="phone"
                  label="Phone number"
                  type="number"
                  kind="phone"
                  required
                />
              ) : null} */}
              {method === "email" ? (
                <Button text={loading ? "Loading" : "Get login link"} />
              ) : null}
              {/* {method === "phone" ? (
                <Button text={loading ? "Loading" : "Get one-time password"} />
              ) : null} */}
            </form>
          </>
        )}

        <div className="mt-8">
          <div className="relative">
            <div className="absolute w-full border-t border-gray-300" />
            <div className="relative -top-3 text-center ">
              <span className="bg-white px-2 text-sm text-gray-500">
                Or enter with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 mt-2 gap-3">
            <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </button>
            <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Enter;
