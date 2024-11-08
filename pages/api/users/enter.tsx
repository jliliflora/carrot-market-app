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
  // console.log(req.body); //백엔드 콘솔 출력

  const { phone, email } = req.body;
  const payload = phone ? { phone: +phone } : { email };
  /*
  const user = await client.user.upsert({
    where: {
      // ...(phone ? { phone: +phone } : {}),
      // ...(email ? { email } : {}),
      ...payload,
    },
    create: {
      name: "Anonymous",
      // ...(phone ? { phone: +phone } : {}),
      // ...(email ? { email } : {}),
      ...payload,
    },
    update: {},
  });*/
  const token = await client.token.create({
    data: {
      payload: "1234",
      user: {
        // 이미 유저를 찾아서 토큰을 부여해줄수도 있고, 새로운 유저를 만듦과 동시에 새로운 토큰도 만들 수 있음
        connectOrCreate: {
          where: {
            ...payload,
          },
          create: {
            name: "Anonymous",
            ...payload,
          },
        },

        //이미 있는 유저에게 새로운 토큰을 부여해주는 코드
        // connect: {
        //   id: user.id,
        // },
      },
    },
  });
  // console.log(user);
  console.log(token);

  /*
  let user;
  if (email) {
    user = await client.user.findUnique({
      where: {
        email,
      },
    });
    if (user) console.log("found it.");
    if (!user) {
      console.log("Did not find. Will create.");
      user = await client.user.create({
        data: {
          name: "Anonymous",
          email,
        },
      });
    }
    console.log(user);
  }
  if (phone) {
    user = await client.user.findUnique({
      where: {
        phone: +phone, //문자열을 숫자로 바꿔줘야할때 +를 붙이면 바뀜!
      },
    });
    if (user) console.log("found it.");
    if (!user) {
      console.log("Did not find. Will create.");
      user = await client.user.create({
        data: {
          name: "Anonymous",
          phone: +phone,
        },
      });
    }
    console.log(user);
  }*/

  return res.status(200).end();
}
export default withHandler("POST", handler);
//여기서 withHandler함수를 호출해서 이 withHandler함수의 return값을 가져와서 실행시키는거임
