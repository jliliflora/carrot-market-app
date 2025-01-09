// get : 유저의 구매목록 데이터 가져오기

import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../../src/libs/server/client";
import withHandler, { ResponseType } from "@/src/libs/server/withHandler";
import { withApiSession } from "@/src/libs/server/withSesstion";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  //여기서 콘솔 찍으면 백엔드 콘솔에서 확인가능함

  const {
    session: { user },
  } = req;

  const purchases = await client.purchase.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      product: {
        include: {
          _count: {
            select: {
              favs: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc", // 내림차순으로 전체 데이터 정렬
    },
  });

  res.json({
    ok: true,
    purchases,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
