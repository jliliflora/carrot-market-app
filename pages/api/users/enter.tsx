import { NextApiRequest, NextApiResponse } from "next";
import client from "../../libs/server/client";

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
