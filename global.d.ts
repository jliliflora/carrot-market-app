import { Prisma } from "@prisma/client";

declare global {
  var client: Prisma | undefined;
}

export {};
