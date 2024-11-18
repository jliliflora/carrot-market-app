declare module "iron-session/next" {
  import { SessionOptions } from "iron-session";
  import { NextApiHandler } from "next";

  export function withIronSessionApiRoute(
    handler: NextApiHandler,
    options: SessionOptions
  ): NextApiHandler;

  export function withIronSessionSsr(
    handler: any,
    options: SessionOptions
  ): any;
}
