// import { nodemailer } from "nodemailer";
// const nodemailer = require("nodemailer"); => require() 구문을 사용하여 모듈을 가져오는 것을 금지해서 import구문으로 변경
import nodemailer from "nodemailer";

// 이메일 관련 환경 변수 확인
if (!process.env.MAIL_ID || !process.env.MAIL_PASSWORD) {
  throw new Error("MAIL_ID and MAIL_PASSWORD must be defined");
}

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
      : {},
  tls: {
    rejectUnauthorized: false,
  },
});

export default smtpTransport;
