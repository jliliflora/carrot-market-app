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
  console.log(product);
  res.json({ ok: true, product });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
