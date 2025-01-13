// import { nodemailer } from "nodemailer";
// const nodemailer = require("nodemailer"); => require() 구문을 사용하여 모듈을 가져오는 것을 금지해서 import구문으로 변경
import nodemailer from "nodemailer";

// 이메일 관련 환경 변수 확인
if (!process.env.MAIL_ID || !process.env.MAIL_PASSWORD) {
  throw new Error("MAIL_ID and MAIL_PASSWORD must be defined");
}
// auth 객체 생성
const auth =
  process.env.MAIL_ID && process.env.MAIL_PASSWORD
    ? { user: process.env.MAIL_ID, pass: process.env.MAIL_PASSWORD }
    : {}; // auth가 없을 때 null로 설정

// auth가 null일 경우 예외를 던짐
if (!auth) {
  throw new Error("MAIL_ID and MAIL_PASSWORD are required to send emails.");
}
/*
const smtpTransport = nodemailer.createTransport({
  service: "Naver",
  host: "smtp.naver.com",
  port: 587,
  auth:
    process.env.MAIL_ID && process.env.MAIL_PASSWORD
      ? {
          user: process.env.MAIL_ID,
          pass: process.env.MAIL_PASSWORD,
        }
      : undefined,
  tls: {
    rejectUnauthorized: false,
  },
});
*/

const smtpTransport = nodemailer.createTransport({
  service: "Naver",
  host: "smtp.naver.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000, // 연결 타임아웃 (10초)
  greetingTimeout: 5000, // 서버 응답 타임아웃 (5초)
  socketTimeout: 10000, // 전체 타임아웃 (10초)
});

// SMTP 서버 연결 확인
smtpTransport.verify((error, success) => {
  if (error) {
    console.log("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Connection Successful:", success);
  }
});

// console.log("MAIL_ID 22:", process.env.MAIL_ID);
// console.log("MAIL_PASSWORD 22:", process.env.MAIL_PASSWORD);

export default smtpTransport;
