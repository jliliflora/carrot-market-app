// get : 다른 유저들이 쓴 리뷰 데이터 가져오기

import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/src/libs/server/withHandler";
import { withApiSession } from "@/src/libs/server/withSesstion";
import client from "../../../../src/libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  //여기서 콘솔 찍으면 백엔드 콘솔에서 확인가능함
  const {
    query: { id },
  } = req;
  const stream = await client.stream.findUnique({
    where: {
      id: +id!,
    },
    include: {
      messages: {
        select: {
          id: true,
          message: true,
          user: {
            select: {
              avatar: true,
              id: true,
            },
          },
        },
      },
    },
  });
  res.json({ ok: true, stream });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
