import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

interface ProfileResponse {
  ok: boolean;
  profile: User;
}

// const fetcher = (url: string) => fetch(url).then((response) => response.json());
// => 매번 useSWR을 사용할때마다 fetcher를 선언하고 사용하는 것은 효율적이지 않아서, Global SWRConfig를 사용해 리팩토링하였음! _app.tsx에서 확인 가능

export default function useUser() {
  // const { data, error } = useSWR("/api/users/me", fetcher);
  const { data, error } = useSWR<ProfileResponse>("/api/users/me"); // 코드 한줄로 데이터 불러오기 쌉가능
  const router = useRouter();

  //useEffect는 data가 바뀌면 실행이 되도록!
  useEffect(() => {
    if (data && !data.ok) {
      router.replace("/enter");
    }
  }, [data, router]);

  return { user: data?.profile, isLoading: !data && !error };
  // isLoading은 data와 error가 없을 떄 true가 됨

  /*
  const [user, setUser] = useState();
  const router = useRouter();
  useEffect(() => {
    fetch("/api/users/me")
      .then((response) => response.json()) //이전 페이지에 대한 히스토리를 남기고 싶지 않을때 replace
      .then((data) => {
        if (!data.ok) {
          return router.replace("/enter");
        }
        setUser(data.profile);
      });
  }, [router]);
  return user;*/
}
