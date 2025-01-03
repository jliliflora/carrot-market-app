import type { NextPage } from "next";
import Layout from "../components/layout";
import Button from "../components/button";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import Link from "next/link";
import { Product, User } from "@prisma/client";
import useMutation from "../libs/client/useMutation";
import { cls } from "../libs/client/utils";
import useUser from "../libs/client/useUser";

interface ProductWithUser extends Product {
  user: User;
}
interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isLiked: boolean;
}

const ItemDetail: NextPage = () => {
  //내가 원한다면 언제어디서든 자유롭게 모든 컴포넌트들의 데이터를 변경이 가능함 = unboundmutate
  const { user, isLoading } = useUser(); //unboundmutate 예시

  const router = useRouter();
  // console.log(router.query);
  const { id, imageUrl } = router.query;

  const { mutate } = useSWRConfig(); //unboundmutate 사용하려면 필요한 코드
  const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  // console.log(data);

  const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);
  const onFavClick = () => {
    //유저에게 화면이 변경된 것부터 보여준 후, 백엔드에 요청보내는 순서
    if (!data) return;
    boundMutate({ ...data, isLiked: !data.isLiked }, false);
    //첫번째 인자에는 가짜데이터를 넣고, 두번째 인자가 true면 SWR이 다시 진짜 데이터를 찾아서 불러오는 것!
    //근데 나는 그냥 캐시만 변경할뿐이라 false로 냅둘거임!
    // boundMutate((prev) => prev && { ...prev, isLiked: !prev.isLiked }, false); => 위와 같은 기능을 하는 코드인데 함수인자로 기존의 캐시를 받을 수 있는 방법임!

    // 다른화면의 데이터를 변경해야할때 쓸 수 있는 예시코드! 표면적으로만 로그아웃을 시키는 코드임
    // mutate("/api/users/me", (prev: any) => ({ ok: !prev.ok }), false);
    toggleFav({});
  };

  return (
    <Layout canGoHome>
      <div className="px-4 py-4">
        <div className="mb-8">
          {imageUrl && (
            <img
              src={imageUrl as string}
              alt={`Product ${id}`}
              className="h-96 bg-slate-300 mx-auto mb-4"
            />
          )}

          <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-slate-300" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {data?.product?.user?.name}
              </p>
              <Link
                href={`/users/profiles/${data?.product?.user?.id}`}
                className="text-xs font-medium text-gray-500"
              >
                View profile &rarr;
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">
              {data?.product?.name}
            </h1>
            <span className="text-3xl block mt-3 text-gray-900">
              ${data?.product?.price}
            </span>
            <p className=" my-6 text-gray-700">{data?.product?.description}</p>
            <div className="flex items-center justify-between space-x-2">
              <Button large text="Talk to seller" />
              <button
                onClick={onFavClick}
                className={cls(
                  "p-3 rounded-md flex items-center justify-center hover:bg-gray-100",
                  data?.isLiked
                    ? "text-red-500 hover:text-red-600"
                    : "text-gray-400 hover:text-gray-500"
                )}
              >
                {data?.isLiked ? (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className=" mt-6 grid grid-cols-2 gap-4">
            {data?.relatedProducts?.map((product) => (
              <div key={product.id}>
                <div className="h-56 w-full mb-4 bg-slate-300" />
                <h3 className="text-gray-700 -mb-1">{product.name}</h3>
                <span className="text-sm font-medium text-gray-900">
                  ${product.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default ItemDetail;
