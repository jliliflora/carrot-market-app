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
  // console.log(req.session); //핸들러를 withIronSessionApiRoute 이 도우미함수로 감싸주었기 때문에 req.session이 있는 것

  const { token } = req.body; //token을 담아 보냄
  // console.log(token);

  //token을 찾아 해당 token이 존재하는지 확인하고, 존재한다면 해당 token을 리턴받고 존재하지않으면 null을 받음
  const foundToken = await client.token.findUnique({
    where: {
      payload: token,
    },
  });
  if (!foundToken) return res.status(404).end();

  // console.log(foundToken); //진짜 db에 있는 token을 입력하면 해당 유저의 토큰 정보를 출력함

  // 만약 token이 존재하면 그 유저의 id를 세션에 저장하는 것
  req.session.user = {
    id: foundToken.userId,
  };
  await req.session.save(); //세션 데이터를 암호화하고 쿠키를 설정!! 이렇게 하면 세션 만들기 끝!

  //쉽게 말해 이 코드는 (18번줄코드)foundToken로 부터 받아낸 token을 삭제할거임! token을 한번만 사용할거기 때문에!!!!
  await client.token.deleteMany({
    where: {
      userId: foundToken.userId,
    },
  });

  // res.status(200).end(); => 코드 일관성유지를 위해 res.json으로 바꿈
  res.json({ ok: true });
}

export default withApiSession(
  withHandler({ method: "POST", handler, isPrivate: false })
);
//여기서 withHandler함수를 호출해서 이 withHandler함수의 return값을 가져와서 실행시키는거임
/* 
export default withIronSessionApiRoute(withHandler("POST", handler), {
  cookieName: "carrotsession",
  password:
    "9845904809485098594385093840598df;slkgjfdl;gkfsdjg;ldfksjgdsflgjdfklgjdflgjflkgjdgd", //쿠키를 암호화하는데에 쓰임
});
*/
