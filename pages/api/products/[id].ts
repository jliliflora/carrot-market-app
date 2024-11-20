//

import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import client from "../../libs/server/client";
import withHandler, { ResponseType } from "@/pages/libs/server/withHandler";
import { withApiSession } from "@/pages/libs/server/withSesstion";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  //여기서 콘솔 찍으면 백엔드 콘솔에서 확인가능함

  // console.log(req.query);
  const { id } = req.query;
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

  const terms = product?.name.split(" ").map((word) => ({
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

  res.json({ ok: true, product, relatedProducts });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
