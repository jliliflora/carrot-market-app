// 콘솔에서 이 해당 user의 id를 보는 것이 목표

import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../libs/server/client";
import withHandler, { ResponseType } from "@/pages/libs/server/withHandler";
import { withApiSession } from "@/pages/libs/server/withSesstion";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  //여기서 콘솔 찍으면 백엔드 콘솔에서 확인가능함
  // console.log(req.session.user); // http://localhost:3000/api/users/me 이 페이지 실행시키면 콘솔에서 잘 출력됨!

  const profile = await client.user.findUnique({
    where: { id: req.session.user?.id },
  });
  // 현재 이메일 인증키를 받고 화면 출력시키는 것까지는 전혀 문제 없음, 폰번호는 현재 BigInt형 때문에 문제가 생기는거 같은데 이멜 인증만 진행할거라서 패쓰하겟음
  res.json({
    ok: true,
    profile,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
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
