// get : 다른 유저들이 쓴 리뷰 데이터 가져오기

import { NextApiRequest, NextApiResponse } from "next";
import client from "../libs/server/client";
import withHandler, { ResponseType } from "@/pages/libs/server/withHandler";
import { withApiSession } from "@/pages/libs/server/withSesstion";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  //여기서 콘솔 찍으면 백엔드 콘솔에서 확인가능함

  const {
    session: { user },
  } = req;
  const reviews = await client.review.findMany({
    where: {
      createdForId: user?.id,
    },
    include: {
      createdBy: {
        select: { id: true, name: true, avatar: true },
      },
    },
    orderBy: {
      createdAt: "desc", // 내림차순으로 전체 데이터 정렬
    },
  });

  res.json({
    ok: true,
    reviews,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
