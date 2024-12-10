// 많은 라이브스트림을 엄청 빨리 생성하는 코드

import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

//array를 빠르게 만드는 쉬운 방식
//[...Array.from(Array(500).keys())];

async function main() {
  [...Array.from(Array(500).keys())].forEach(async (item) => {
    const stream = await client.stream.create({
      data: {
        name: String(item),
        description: String(item),
        price: item,
        user: {
          connect: {
            id: 26,
          },
        },
      },
    });
    console.log(`${item}/500`);
  });
}

// main 호출
main()
  .catch((e) => console.log(e)) //에러가 있다면 콘솔에 에러호출
  .finally(() => client.$disconnect()); //다 끝났으면 disconnect함수 호출
