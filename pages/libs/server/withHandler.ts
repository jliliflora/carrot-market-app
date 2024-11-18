import { NextApiRequest, NextApiResponse } from "next";

//function안에 function으로 우리가 원하는대로 설정해서 return할 수 있게끔 만들었음

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

// 2개 이상의 인자가 있다면 객체로 값들을 보내는 방식으로 코드를 정리할 수 있음
interface ConfigType {
  method: "GET" | "POST" | "DELETE";
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
  isPrivate?: boolean;
}

export default function withHandler({
  method,
  isPrivate = true,
  handler,
}: ConfigType) {
  // 함수호출이 됐을 때, nextJS가 실행할 함수
  return async function (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<any> {
    // 첨부터 요청이 잘못들어왔을때, bad request로부터 보호하는 코드임
    if (req.method !== method) {
      return res.status(405).end();
    }
    // 유저가 로그인 상태인지 아닌지 체크하기
    if (isPrivate && !req.session.user) {
      return res.status(401).json({ ok: false, error: "Plz log in." });
    }
    try {
      await handler(req, res); // = handler(req, res) = argument에 "handler"가 들어왔다면 enter.tsx의 "handler"함수로 대치되는 것!!!
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error }); // 사용자에게 에러메세지 보내기
    }
  };
}

// 그니까 "await fn(req, res);"=>
