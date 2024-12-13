// get : 스트리밍 데이터 가져오기, post : 새 스트리밍 게시물 데이터 만들기

import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/pages/libs/server/withHandler";
import { withApiSession } from "@/pages/libs/server/withSesstion";
import client from "../../libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  //여기서 콘솔 찍으면 백엔드 콘솔에서 확인가능함

  const {
    session: { user },
    body: { name, price, description },
    query: { page },
  } = req;
  if (req.method === "POST") {
    const stream = await client.stream.create({
      data: {
        name,
        price,
        description,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({ ok: true, stream });
  } else if (req.method === "GET") {
    /*
    const streams = await client.stream.findMany({
      take: 10, //10개씩 가져오기
      skip: 10, //이미 본 앞의 10개를 건너뛰고 다음 데이터 10개 가져오기
    });
    res.json({ ok: true, streams });
    */
    if (!req.query.page) {
      const streams = await client.stream.findMany({
        orderBy: {
          createdAt: "desc", // 내림차순으로 전체 데이터 정렬
        },
      });
      res.json({ ok: true, streams });
    } else {
      const streams = await client.stream.findMany({
        take: 10,
        skip: 10 * (+page! - 1),
        orderBy: {
          createdAt: "desc", // 내림차순으로 전체 데이터 정렬
        },
      });
      res.json({ ok: true, streams });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
