// 화면 컴포넌트 재활용
import useSWR from "swr";
import { ProductWithCount } from "../index";
import Item from "./item";

interface ProductListProps {
  kind: "favs" | "sales" | "purchases";
}
interface Record {
  id: number;
  product: ProductWithCount;
}

interface ProductListResponse {
  [key: string]: Record[];
}

export default function ProductList({ kind }: ProductListProps) {
  const { data, isLoading, error } = useSWR<ProductListResponse>(
    `/api/users/me/${kind}`
  );
  // console.log(data);

  if (isLoading) {
    return <div className="pt-10 px-2 text-center">Loading...</div>;
  }
  if (error) {
    return <div>에러가 발생했습니다!</div>;
  }

  if (!data || data[kind]?.length === 0) {
    switch (kind) {
      case "favs":
        return (
          <div className="pt-10 px-2 text-center text-gray-600">
            관심상품 목록이 비어있어요.
            <br /> 마음에 드는 상품을 즐겨찾기 해보세요! 🧡
          </div>
        );

      case "sales":
        return (
          <div className="pt-10 px-2 text-center text-gray-600">
            판매상품 목록이 비어있어요.
            <br /> 상품을 등록하고 판매를 시작해보세요! 🥕
          </div>
        );

      case "purchases":
        return (
          <div className="pt-10 px-2 text-center text-gray-600">
            구매내역 목록이 비어있어요.
            <br /> 마음에 드는 상품을 구매해보세요! 🥕
          </div>
        );

      default:
        return (
          <div className="pt-10 px-2 text-center text-gray-600">
            정보가 없습니다.
          </div>
        );
    }
  }

  return (
    <>
      {data[kind]?.map((record) => (
        <Item
          id={record.product.id}
          key={record.id}
          title={record.product.name}
          price={record.product.price}
          hearts={record.product._count.favs}
          imageUrl="/images/default.jpg"
        />
      ))}
    </>
  );
}
