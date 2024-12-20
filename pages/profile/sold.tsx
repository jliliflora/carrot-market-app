import type { NextPage } from "next";
import Layout from "../components/layout";
import Item from "../components/item";
import ProductList from "../components/product-list";

const Sold: NextPage = () => {
  return (
    <Layout title="판매내역" canGoBack>
      <div className="flex flex-col space-y-5 pt-5">
        <ProductList kind="sales" />
        {/* {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, i) => (
          <Item
            id={i}
            key={i}
            title="iPhone 14"
            price={99}
            comments={1}
            hearts={1}
          />
        ))} */}
      </div>
    </Layout>
  );
};
export default Sold;
