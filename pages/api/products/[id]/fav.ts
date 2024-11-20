//

import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/pages/libs/server/client";
import withHandler, { ResponseType } from "@/pages/libs/server/withHandler";
import { withApiSession } from "@/pages/libs/server/withSesstion";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  //여기서 콘솔 찍으면 백엔드 콘솔에서 확인가능함

  const {
    query: { id },
    session: { user },
  } = req;
  // 우선 데이터가 db에 존재하는 확인!
  const alreadyExists = await client.fav.findFirst({
    // productId가 query의 id와 같을 뿐 아니라 userId가 session의 user.id랑도 같은 fav이 데이터를 찾는것!
    where: {
      //   productId: +id.toString(),
      productId: +id!,
      userId: user?.id,
    },
  });

  if (alreadyExists) {
    //delete
    await client.fav.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  } else {
    //create
    await client.fav.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        product: {
          connect: {
            id: +id!,
          },
        },
      },
    });
  }

  res.json({ ok: true });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
