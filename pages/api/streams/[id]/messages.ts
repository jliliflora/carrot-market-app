// get : 다른 유저들이 쓴 리뷰 데이터 가져오기

import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/pages/libs/server/withHandler";
import { withApiSession } from "@/pages/libs/server/withSesstion";
import client from "../../../libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  //여기서 콘솔 찍으면 백엔드 콘솔에서 확인가능함
  const {
    query: { id },
    body,
    session: { user },
  } = req;
  const message = await client.message.create({
    data: {
      message: body.message,
      stream: {
        connect: {
          id: +id!,
        },
      },
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  });
  res.json({ ok: true, message });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
