import type { NextPage } from "next";
import Layout from "../components/layout";
import Item from "../components/item";
import ProductList from "../components/product-list";

const Loved: NextPage = () => {
  return (
    <Layout title="관심목록" canGoBack>
      <div className="flex flex-col space-y-5 pt-5">
        <ProductList kind="favs" />
      </div>
    </Layout>
  );
};
export default Loved;
