//product: 해당 상품 정보 가져오기, relatedProducts: 관련 상품 정보 가져오기, terms: 해당 상품 이름 쪼개기

import { NextApiRequest, NextApiResponse } from "next";
import client from "@/pages/libs/server/client";
import withHandler, { ResponseType } from "@/pages/libs/server/withHandler";
import { withApiSession } from "@/pages/libs/server/withSesstion";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  //여기서 콘솔 찍으면 백엔드 콘솔에서 확인가능함

  // console.log(req.query);
  const {
    query: { id },
    session: { user },
  } = req;
  const product = await client.product.findUnique({
    where: {
      // id: +id.toString(),
      id: +id!,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  // console.log(product);

  const terms = product?.name.split(" ").map((word: string) => ({
    name: {
      contains: word,
    },
  }));
  // console.log(terms);
  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      //id가 현재 보고 있는 상품과 같지 않아야하는 조건 걸어주기
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
    //관련 상품이 4개만 보이도록
    take: 4,
  });
  // console.log(relatedProducts);

  const isLiked = Boolean(
    await client.fav.findFirst({
      where: {
        productId: product?.id,
        userId: user?.id,
      },
      select: {
        id: true,
      },
    })
  );

  res.json({ ok: true, product, isLiked, relatedProducts });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
