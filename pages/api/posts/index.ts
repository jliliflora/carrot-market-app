// post : 동네생활 게시물 등록하기, get : 동네생활 게시물 데이터 가져오기 + 지역필터링

import { NextApiRequest, NextApiResponse } from "next";
import client from "../../libs/server/client";
import withHandler, { ResponseType } from "@/pages/libs/server/withHandler";
import { withApiSession } from "@/pages/libs/server/withSesstion";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  //여기서 콘솔 찍으면 백엔드 콘솔에서 확인가능함

  if (req.method === "POST") {
    const {
      body: { question, latitude, longitude },
      session: { user },
      // query,
    } = req;
    // console.log(longitude, latitude);

    const post = await client.post.create({
      data: {
        question,
        latitude,
        longitude,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({
      ok: true,
      post,
    });
  }
  if (req.method === "GET") {
    const {
      query: { latitude, longitude, page },
    } = req;
    // const parsedLatitude = parseFloat(latitude.toString());
    // const parsedLongitue = parseFloat(longitude.toString());

    if (!req.query.page) {
      const posts = await client.post.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              wondering: true,
              answers: true,
            },
          },
        },
        where: {
          latitude: {
            gte: Number(latitude) - 0.01,
            lte: Number(latitude) + 0.01,
          },
          longitude: {
            gte: Number(longitude) - 0.01,
            lte: Number(longitude) + 0.01,
          },
        },
        orderBy: {
          createdAt: "desc", // 내림차순으로 전체 데이터 정렬
        },
      });
      res.json({ ok: true, posts });
    } else {
      const posts = await client.post.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              wondering: true,
              answers: true,
            },
          },
        },
        where: {
          latitude: {
            gte: Number(latitude) - 0.01,
            lte: Number(latitude) + 0.01,
          },
          longitude: {
            gte: Number(longitude) - 0.01,
            lte: Number(longitude) + 0.01,
          },
        },
        take: 10,
        skip: 10 * (+page! - 1),
        orderBy: {
          createdAt: "desc", // 내림차순으로 전체 데이터 정렬
        },
      });
      res.json({ ok: true, posts });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
