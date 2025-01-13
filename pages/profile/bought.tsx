import type { NextPage } from "next";
import Layout from "../components/layout";
import ProductList from "../components/product-list";
import useUser from "../../src/libs/client/useUser";
import Head from "next/head";

const Bought: NextPage = () => {
  //로그인이 안됐을때 enter로 redirect
  const {} = useUser();
  // console.log(user);

  return (
    <Layout title="구매내역" canGoBack>
      <Head>
        <title>구매내역</title>
      </Head>
      <div className="flex flex-col space-y-5 pt-5">
        <ProductList kind="purchases" />
      </div>
    </Layout>
  );
};
export default Bought;
