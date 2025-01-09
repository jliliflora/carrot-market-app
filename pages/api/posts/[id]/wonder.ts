// post : 궁금해요 데이터 api

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
  } = req;
  const alreadyExists = await client.wondering.findFirst({
    where: {
      userId: user?.id,
      postId: +id!,
    },
    select: {
      id: true,
    },
  });

  if (alreadyExists) {
    //delete
    await client.wondering.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  } else {
    //create
    await client.wondering.create({
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
      },
    });
  }

  res.json({
    ok: true,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
