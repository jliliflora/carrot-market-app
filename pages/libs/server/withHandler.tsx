import { NextApiRequest, NextApiResponse } from "next";

//function안에 function으로 우리가 원하는대로 설정해서 return할 수 있게끔 만들었음

export default function withHandler(
  method: "GET" | "POST" | "DELETE",
  fn: (req: NextApiRequest, res: NextApiResponse) => void
) {
  // 함수호출이 됐을 때, nextJS가 실행할 함수
  return async function (req: NextApiRequest, res: NextApiResponse) {
    //첨부터 요청이 잘못들어왔을때, bad request로부터 보호하는 코드임
    if (req.method !== method) {
      return res.status(405).end();
    }
    try {
      await fn(req, res); // = handler(req, res) = argument에 "handler"가 들어왔다면 enter.tsx의 "handler"함수로 대치되는 것!!!
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error }); // 사용자에게 에러메세지 보내기
    }
  };
}

// 그니까 "await fn(req, res);"=>
