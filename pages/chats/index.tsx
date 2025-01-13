import type { NextPage } from "next";
import Layout from "../components/layout";
import Link from "next/link";
import useUser from "../../src/libs/client/useUser";
import DemoAlert from "../components/demoalert";
import Head from "next/head";

const Chats: NextPage = () => {
  //로그인이 안됐을때 enter로 redirect
  const {} = useUser();
  // console.log(user);

  return (
    <Layout hasTabBar title="채팅">
      <Head>
        <title>채팅</title>
      </Head>
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
        <DemoAlert />
      </div>
    </Layout>
  );
};
export default Chats;
