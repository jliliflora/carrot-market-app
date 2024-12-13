// get : 유저 프로필 데이터 가져오기, post : 유저 프로필 정보 편집하기

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

  if (req.method === "GET") {
    const profile = await client.user.findUnique({
      where: { id: req.session.user?.id },
    });
    // 현재 이메일 인증키를 받고 화면 출력시키는 것까지는 전혀 문제 없음, 폰번호는 현재 BigInt형 때문에 문제가 생기는거 같은데 이멜 인증만 진행할거라서 패쓰하겟음
    res.json({
      ok: true,
      profile,
    });
  }
  if (req.method === "POST") {
    const {
      session: { user },
      body: { email, phone, name },
    } = req;

    //편집하기 전 현재 유저의 정보
    const currentUser = await client.user.findUnique({
      where: {
        id: user?.id,
      },
    });

    // body안에 email이 존재하는지 + 현재 사용중인 이메일과 값이 다른지부터 확인
    if (email && email !== currentUser?.email) {
      const alreadyExists = Boolean(
        await client.user.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
          },
        })
      );
      // 이미 그 이메일을 사용중이라면 에러 출력
      if (alreadyExists) {
        return res.json({
          ok: false,
          error: "Email already taken.",
        });
      }
      // 사용중인 유저가 없으면 업데이트!
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          email,
        },
      });
      res.json({ ok: true });
    }
    if (phone && phone !== currentUser?.phone) {
      const alreadyExists = Boolean(
        await client.user.findUnique({
          where: {
            phone,
          },
          select: {
            id: true,
          },
        })
      );
      // 이미 그 번호를 사용중이라면 에러 출력
      if (alreadyExists) {
        return res.json({
          ok: false,
          error: "Phone already taken.",
        });
      }
      // 사용중인 유저가 없으면 업데이트!
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          phone,
        },
      });
      res.json({ ok: true });
    }
    // 이름은 중복가능해서 유일한지 검사 안해도 됨
    if (name) {
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          name,
        },
      });
    }
    // 두 if문에 걸러지지 않을때(변경된 값이 없는 채로 넘어왔을때) 보낼 응답
    res.json({ ok: true });
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
