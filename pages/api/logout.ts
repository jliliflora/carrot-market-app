// 콘솔에서 이 해당 user의 id를 보는 것이 목표

import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/pages/libs/server/withHandler";
import { withApiSession } from "@/pages/libs/server/withSesstion";
import client from "../libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  //여기서 콘솔 찍으면 백엔드 콘솔에서 확인가능함
  // console.log(req.session); // http://localhost:3000/api/logout 이 페이지 실행시키면 콘솔에서 잘 출력됨!

  // 로그인 상태인지 확인 (isPrivate: true로 설정)
  if (!req.session.user) {
    return res.status(401).json({ ok: false, error: "Not logged in" });
  }

  // 세션에서 user 정보 삭제 (로그아웃)
  req.session.user = undefined;
  //   console.log("-----------");
  //   console.log(req.session);
  await req.session.save(); // 변경된 세션을 저장

  return res.json({
    ok: true,
    message: "Logged out successfully",
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: true,
  })
);
