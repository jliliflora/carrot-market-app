import type { NextPage } from "next";
import Layout from "../components/layout";
import Item from "../components/item";
import ProductList from "../components/product-list";
import useUser from "../libs/client/useUser";

const Loved: NextPage = () => {
  //로그인이 안됐을때 enter로 redirect
  const { user } = useUser();
  // console.log(user);

  return (
    <Layout title="관심목록" canGoBack>
      <div className="flex flex-col space-y-5 pt-5">
        <ProductList kind="favs" />
      </div>
    </Layout>
  );
};
export default Loved;
