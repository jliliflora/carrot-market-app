// post : product 데이터 만들기, get : product 데이터 가져오기

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
  if (req.method === "GET") {
    const {
      query: { page },
    } = req;

    if (!req.query.page) {
      const products = await client.product.findMany({
        include: {
          _count: {
            select: {
              favs: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc", // 내림차순으로 전체 데이터 정렬
        },
      });
      res.json({ ok: true, products });
    } else {
      const products = await client.product.findMany({
        include: {
          _count: {
            select: {
              favs: true,
            },
          },
        },
        take: 10,
        skip: 10 * (+page! - 1),
        orderBy: {
          createdAt: "desc", // 내림차순으로 전체 데이터 정렬
        },
      });
      res.json({ ok: true, products });
    }

    /*
    const products = await client.product.findMany({
      //product가 자신이 갖고 있는 fav의 갯수를 가질 수 있음
      include: {
        _count: {
          select: {
            favs: true,
          },
        },
      },
    });
    res.json({
      ok: true,
      products,
    });
    */
  }
  if (req.method === "POST") {
    const {
      body: { name, price, description },
      session: { user },
    } = req;

    const product = await client.product.create({
      data: {
        name,
        price: +price,
        description,
        image: "xx",
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    // 현재 이메일 인증키를 받고 화면 출력시키는 것까지는 전혀 문제 없음, 폰번호는 현재 BigInt형 때문에 문제가 생기는거 같은데 이멜 인증만 진행할거라서 패쓰하겟음
    res.json({
      ok: true,
      product,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
/*
export default withIronSessionApiRoute(withHandler("GET", handler), {
  cookieName: "carrotsession",
  password:
    "9845904809485098594385093840598df;slkgjfdl;gkfsdjg;ldfksjgdsflgjdfklgjdflgjflkgjdgd", //쿠키를 암호화하는데에 쓰임
});
*/
