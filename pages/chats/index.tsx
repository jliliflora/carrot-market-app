import type { NextPage } from "next";
import Layout from "../components/layout";
import Link from "next/link";
import useUser from "../libs/client/useUser";

const Chats: NextPage = () => {
  //로그인이 안됐을때 enter로 redirect
  const { user } = useUser();
  // console.log(user);

  return (
    <Layout hasTabBar title="채팅">
      <div className=" divide-y-[1px] relative">
        {[1, 1, 1, 1, 1, 1, 1].map((_, i) => (
          <Link
            href={`/chats/${i}`}
            key={i}
            className="flex px-4 cursor-pointer py-3 items-center space-x-3"
          >
            <div className="w-12 h-12 rounded-full bg-slate-300" />
            <div>
              <p className="text-gray-700">Steve Jebs</p>
              <p className="text-sm  text-gray-500">
                See you tomorrow in the corner at 2pm!
              </p>
            </div>
          </Link>
        ))}
        <div className="divide-y-0">
          <p className="fixed bottom-24 left-1/2 translate-x-[-50%] bg-orange-200 bg-opacity-50 border border-orange-300 rounded-xl px-4 py-2 w-[300px] text-center text-orange-500">
            이 페이지는 데모용으로 제공됩니다.
            <br /> 프리뷰를 통해 미리 둘러보고 가세요! 🚧
          </p>
        </div>
      </div>
    </Layout>
  );
};
export default Chats;
