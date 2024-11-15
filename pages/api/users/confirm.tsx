import { NextApiRequest, NextApiResponse } from "next";
import client from "../../libs/server/client";
import withHandler, { ResponseType } from "@/pages/libs/server/\bwithHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { token } = req.body;
  console.log(token);
  res.status(200).end();
}

export default withHandler("POST", handler);
//여기서 withHandler함수를 호출해서 이 withHandler함수의 return값을 가져와서 실행시키는거임
