import type { NextPage } from "next";
import Layout from "../components/layout";
import Message from "../components/message";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Stream } from "@prisma/client";
import { useForm } from "react-hook-form";
import useMutation from "../libs/client/useMutation";
import useUser from "../libs/client/useUser";

interface StreamMessage {
  message: string;
  id: number;
  user: {
    avatar?: string;
    id: number;
  };
}
interface StreamWithMessages extends Stream {
  messages: StreamMessage[];
}
interface StreamResponse {
  ok: true;
  stream: StreamWithMessages;
}
interface MessageForm {
  message: string;
}
interface ChatStream {
  id: number;
  messages: {
    id: number;
    message: string;
    user: {
      id: number;
      name: string;
    };
  }[];
}

interface ChatCache {
  stream: ChatStream;
}

const StreamDetail: NextPage = () => {
  // 유저 본인이 보낸 메세지인지 id 확인을 위해 가져온거 + 이 코드를 통해 로그인 필터링까지 해줌
  const { user } = useUser();
  // get
  const router = useRouter();
  const { data, mutate } = useSWR<StreamResponse>(
    router.query.id ? `/api/streams/${router.query.id}` : null,
    {
      refreshInterval: 1000, //실시간기능을 제공 할 순 없지만, 새 메세지를 1초마다 확인하게끔 하는 코드
    }
  );

  const { register, handleSubmit, reset } = useForm<MessageForm>();

  //   const [sendMessage, { loading, data: sendMessageData }] = useMutation => data: sendMessageData 이게 지금 사용을 안해서 일단 주석처리
  const [sendMessage, { loading, data: sendMessageData }] = useMutation(
    `/api/streams/${router.query.id}/messages`
  );
  const onValid = (form: MessageForm) => {
    if (loading) return;
    reset();
    //nextJS 서버리스 환경에선 실시간기능을 사용할 수 없음 => 그래서 그냥 화면에만 올라가도록 가짜실시간기능을 추가한 것 / 사용자에게 최대한 많은 실시간 경험을 제공하기 위한 코드
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          stream: {
            ...prev.stream,
            messages: [
              ...prev.stream.messages,
              {
                id: Date.now(),
                message: form.message,
                user: {
                  ...user,
                },
              },
            ],
          },
        } as any),
      false
    ); //mutate는 캐시에 가짜 데이터를 넣을 수 있게 해주지만, 그 즉시 백엔드에서 이중확인함 그래서 그렇게하지않도록 false를 해둔것
    sendMessage(form); //백엔드로 post 요청을 보내는 함수
  };

  /*
  // 사용자가 새 메세지를 보낼 때마다 다시 fetch됨
  useEffect(() => {
    if (sendMessageData && sendMessageData.ok) {
      mutate();
    }
  }, [sendMessageData, mutate]);
  */

  return (
    <Layout canGoStreams>
      <div className="py-10 px-4  space-y-4">
        <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">
            {data?.stream?.name}
          </h1>
          <span className="text-2xl block mt-3 text-gray-900">
            ${data?.stream?.price}
          </span>
          <p className=" my-6 text-gray-700">{data?.stream?.description}</p>
        </div>
        <div className="relative">
          <p className="absolute top-[-1.3rem] right-[0rem] bg-orange-200 bg-opacity-60 border border-orange-300 rounded-xl px-[0.4rem] py-[0.35rem] w-[310px] text-center text-orange-500 text-[0.8rem]">
            채팅 기능이 활성화되었습니다!
            <br /> 실시간은 아니지만, 흥미로운 반응을 기다리고있어요 😆
          </p>

          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <div className="py-10 pb-16 h-[50vh] overflow-y-scroll  px-4 space-y-4">
            {data?.stream.messages.map((message) => (
              <Message
                key={message.id}
                message={message.message}
                reversed={message.user.id === user?.id}
              />
            ))}
          </div>
          <div className="fixed py-2 bg-white  bottom-0 inset-x-0">
            <form
              onSubmit={handleSubmit(onValid)}
              className="flex relative max-w-md items-center  w-full mx-auto"
            >
              <input
                type="text"
                {...register("message", { required: true })}
                className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
              />
              <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                  &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default StreamDetail;
