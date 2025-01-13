// import twilio from "twilio";
import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../src/libs/server/client";
import withHandler, { ResponseType } from "@/src/libs/server/withHandler";
import smtpTransport from "@/pages/api/email";
// import { SentMessageInfo } from "nodemailer";

// const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN); 사용안함

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

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  // console.log(req.body); //백엔드 콘솔 출력

  const { phone, email } = req.body;
  // const payload = phone ? { phone: +phone } : { email };
  const user = phone ? { phone } : email ? { email } : null;
  if (!user) return res.status(400).json({ ok: false }); //BadRequest
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
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
      payload,
      user: {
        // 이미 유저를 찾아서 토큰을 부여해줄수도 있고, 새로운 유저를 만듦과 동시에 새로운 토큰도 만들 수 있음
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
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

  /*번호 인증키는 아직 잘... 대체 가능한 걸로 다시 시도해봐야할듯*/
  if (phone) {
    /*const message = await twilioClient.messages.create({
      messagingServiceSid: process.env.TWILIO_MSID,
      to: process.env.MY_PHONE!,
      body: `Your login token is ${payload}.`,
    });
    console.log(message);*/
  }

  /*이메일 인증 보내기 성공~! */
  /*
  if (email) {
    const mailOptions = {
      from: process.env.MAIL_ID,
      to: email,
      subject: "Nomad Carrot Authentication Email",
      text: `Authentication Code : ${payload}`,
    };
    const result = smtpTransport.sendMail(
      mailOptions,
      (error: Error | null, res: SentMessageInfo) => {
        if (error) {
          console.log(error);
          return null;
        } else {
          console.log(res);
          return null;
        }
      }
    );

    smtpTransport.close();
    console.log(result);
  }*/
  if (email) {
    // SMTP 서버 연결 확인
    try {
      await smtpTransport.verify();
      console.log("SMTP Server is ready to send emails");

      // 이메일 발송
      const mailOptions = {
        from: process.env.MAIL_ID,
        to: email,
        subject: "Nomad Carrot Authentication Email",
        text: `Authentication Code: ${payload}`,
      };

      const sendResult = await smtpTransport.sendMail(mailOptions);
      console.log("Email sent:", sendResult);

      // 연결 닫기
      smtpTransport.close();
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ ok: false, error: "Failed to send email" });
    }
  }

  return res.json({
    ok: true,
  });
}
export default withHandler({ methods: ["POST"], handler, isPrivate: false });
//여기서 withHandler함수를 호출해서 이 withHandler함수의 return값을 가져와서 실행시키는거임
