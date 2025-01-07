import { PrismaClient } from "@prisma/client";

// global안에 client가 없어서 타입선언해주는 코드
/* 빌드 에러가 나서 global.d.ts 파일로 따로 빼둠
declare global {
  var client: PrismaClient | undefined;
}
*/

// 이 파일을 처음 실행하게 되면 client에는 아무것도 없어서 새 PrismaClient를 만들게 됨
const client = global.client || new PrismaClient();

if (process.env.NODE_ENV === "development") global.client = client; //그래서 만들어진 client를 global.client에 저장시킴

export default client;
// 이후 다음부터 실행을 할때엔 global.client가 이미 만들어져 있고 global.client로 바로 들어갈 수 있는 것임

/*
이 코드가 필요한 이유 :
일반적으로 Prisma Client는 모듈이나 함수 등이 실행될 때마다 새로운 인스턴스가 생성됩니다. 
그러나 이는 성능에 영향을 미칠 수 있으며, 특히 개발 환경에서 빈번하게 코드를 수정하고 테스트하는 경우에 더욱 그렇습니다.

따라서 개발 환경에서는 기본적으로 Prisma Client 인스턴스를 한 번 생성한 다음, 이를 재사용하도록하는 것이 좋습니다. 
이렇게하면 코드를 실행할 때마다 Prisma Client를 생성하지 않고 기존 인스턴스를 사용하여 성능을 향상시킬 수 있습니다.
*/
