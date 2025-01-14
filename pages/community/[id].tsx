import type { NextPage } from "next";
import Layout from "../components/layout";
import TextArea from "../components/textarea";
import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import { Answer, Post, User } from "@prisma/client";
import useMutation from "../../src/libs/client/useMutation";
import { cls } from "../../src/libs/client/utils";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { format } from "date-fns";
import useUser from "../../src/libs/client/useUser";
import Head from "next/head";
import Loader from "../components/loadingspin";

interface AnswerWithUser extends Answer {
  user: User;
}
interface PostWithUser extends Post {
  user: User;
  _count: {
    answers: number;
    wondering: number;
  };
  answers: AnswerWithUser[];
}
interface CommunityPostResponse {
  ok: boolean;
  post: PostWithUser;
  isWondering: boolean;
}
interface AnswerForm {
  answer: string;
  //   formErrors?: string;
  description?: { message: string };
}
// 오류떠서 추가한 코드임
// interface AnswerData {
//   ok: boolean;
//   // 필요시 다른 필드 추가
// }

interface AnswerResponse {
  ok: boolean;
  response: Answer;
}

const CommunityPostDetail: NextPage = () => {
  //로그인이 안됐을때 enter로 redirect
  const {} = useUser();
  // console.log(user);

  // 질문 게시물 데이터 가져오기
  const router = useRouter();
  const { data, mutate, isLoading } = useSWR<CommunityPostResponse>(
    router.query.id ? `/api/posts/${router.query.id}` : null
  );
  // console.log(data);

  //궁금해요 버튼 로직
  const [wonder, { loading }] = useMutation(
    `/api/posts/${router.query.id}/wonder`
  );
  const onWonderClick = () => {
    if (!data) return;
    // 백엔드 실행시키전에 화면부터 먼저 작동
    mutate(
      {
        ...data,
        post: {
          ...data.post,
          _count: {
            ...data.post._count,
            wondering: data.isWondering
              ? data?.post._count.wondering - 1
              : data?.post._count.wondering + 1,
          },
        },
        isWondering: !data.isWondering,
      },
      false
    );
    //엄청빨리 클릭하면 삭제요청이랑 생성요청이 동시에 날아가는 경우가 발생해서 꼬임이 발생함
    //그래서 이전 요청이 완료된 후에만 백엔드 요청을 보내게 끔 if문 설정!
    if (!loading) {
      wonder({});
    }
  };

  // 답변창(댓글창) 로직
  // question에 answer을 보내기 위한 코드
  const [sendAnswer, { data: answerData, loading: answerLoading }] =
    useMutation<AnswerForm, AnswerResponse>(
      `/api/posts/${router.query.id}/answers`
    );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
    clearErrors,
  } = useForm<AnswerForm>();

  const onValid = (form: AnswerForm) => {
    // console.log(form);
    //submit버튼을 눌러서 answer을 제출할때, answerLoading이 로딩중이라면 함수 종료 시키기
    if (answerLoading) return;

    // 'ok'를 추가하여 'AnswerData' 타입으로 변환
    // const answerData: AnswerData = { ...form, ok: true }; => useMutation 훅 수정으로 코드 원복시켜서 주석처리

    //로딩중이 아니라면, form을 담아서 sendAnswer함수 실행
    sendAnswer(form);
  };

  // answerData가 존재하고 동시에 answerData.ok응답을 받았으면 form을 비울거임
  useEffect(() => {
    if (answerData && answerData.ok) {
      reset();
      //mutate로 refetch해서 새로 등록된 댓글이 바로 화면에 보이도록 함
      mutate();
    }
  }, [answerData, reset, mutate]);

  const checkLength = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length < 5) {
      setError("description", { message: "답변은 5글자 이상이어야 합니다." });
    } else {
      clearErrors("description"); // 에러를 명시적으로 초기화
    }
  };

  return (
    <Layout canGoPosts>
      <Head>
        <title>동네생활</title>
      </Head>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-screen -translate-y-12">
          <Loader />
        </div>
      ) : (
        <div>
          <span className="inline-flex my-3 ml-4 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            동네질문
          </span>
          <div className="flex mb-3 px-4 cursor-pointer pb-3  border-b items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-300" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {data?.post?.user?.name}
              </p>
              <Link
                href={`/users/profiles/${data?.post?.user?.id}`}
                className="text-xs font-medium text-gray-500"
              >
                View profile &rarr;
              </Link>
            </div>
          </div>
          <div>
            <div className="mt-2 px-4 text-gray-700">
              <span className="text-orange-500 font-medium">Q.</span>{" "}
              {data?.post?.question}
            </div>
            <div className="flex px-4 space-x-5 mt-3 text-gray-700 py-2.5 border-t border-b-[2px]  w-full">
              <button
                onClick={onWonderClick}
                className={cls(
                  "flex space-x-2 items-center text-sm",
                  data?.isWondering ? "text-teal-600" : ""
                )}
              >
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
                <span>궁금해요 {data?.post?._count?.wondering}</span>
              </button>
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
                <span>답변 {data?.post._count.answers}</span>
              </span>
            </div>
          </div>
          <div className="px-4 my-5 space-y-5">
            {data?.post?.answers?.map((answer) => (
              <div key={answer.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-slate-200 rounded-full" />
                <div>
                  <span className="text-sm block font-medium text-gray-700">
                    {answer.user.name}
                  </span>
                  <span className="text-xs text-gray-500 block ">
                    {format(answer.createdAt, "yyyy-MM-dd HH:mm:ss")}
                  </span>
                  <p className="text-gray-700 mt-2">{answer.answer} </p>
                </div>
              </div>
            ))}
          </div>
          <form className="px-4 relative" onSubmit={handleSubmit(onValid)}>
            {errors.description &&
              typeof errors.description.message === "string" && (
                <p className="absolute -top-12 left-4 text-red-500 border border-red-500 rounded-xl px-4 py-2 max-w-xs bg-red-100 text-base opacity-85">
                  {errors.description.message}
                </p>
              )}
            <TextArea
              name="description"
              placeholder="Answer this question!"
              required
              register={register("answer", { required: true, minLength: 5 })}
              onChange={checkLength}
            />

            <button className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none ">
              {answerLoading ? "Loading..." : "Reply"}
            </button>
          </form>
        </div>
      )}
    </Layout>
  );
};
export default CommunityPostDetail;
