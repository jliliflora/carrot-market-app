import { NextApiRequest, NextApiResponse } from "next";
import client from "../../libs/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(401).end();
  }
  console.log(req.body.email); //form의 정보를 정상적으로 받고 있는지 확인
  res.status(200).end();
}
