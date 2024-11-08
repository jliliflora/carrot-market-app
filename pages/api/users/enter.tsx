import { NextApiRequest, NextApiResponse } from "next";
import client from "../../libs/server/client";
import withHandler from "@/pages/libs/server/\bwithHandler";

/*
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(401).end();
  }
  console.log(req.body); //form의 정보를 정상적으로 받고 있는지 콘솔로 확인
  // console.log(req.body.email);
  res.status(200).end();
  // res.json({ ok: true });
}
*/

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body); //백엔드 콘솔 출력
  return res.status(200).end();
}
export default withHandler("POST", handler);
//여기서 withHandler함수를 호출해서 이 withHandler함수의 return값을 가져와서 실행시키는거임
