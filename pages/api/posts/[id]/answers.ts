// post : 댓글(답글) 등록시키기

import {} from "iron-session/next";
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
    query: { id },
    session: { user },
    body: { answer },
  } = req;
  /* 사용 안함
  const post = await client.post.findUnique({
    where: {
      id: +id!,
    },
    select: {
      id: true,
    },
  });*/

  const newAnswer = await client.answer.create({
    data: {
      user: {
        connect: {
          id: user?.id,
        },
      },
      post: {
        connect: {
          id: +id!,
        },
      },
      answer,
    },
  });
  console.log(newAnswer);

  res.json({
    ok: true,
    // post,
    answer: newAnswer,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
