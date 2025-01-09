import type { NextPage } from "next";
import Layout from "../components/layout";
import ProductList from "../components/product-list";
import useUser from "../../src/libs/client/useUser";

const Sold: NextPage = () => {
  //로그인이 안됐을때 enter로 redirect
  const {} = useUser();
  // console.log(user);

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
