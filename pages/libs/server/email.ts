// import { nodemailer } from "nodemailer";
// const nodemailer = require("nodemailer"); => require() 구문을 사용하여 모듈을 가져오는 것을 금지해서 import구문으로 변경
import nodemailer from "nodemailer";

const smtpTransport = nodemailer.createTransport({
  service: "Naver",
  host: "smtp.naver.com",
  port: 587,
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export default smtpTransport;
