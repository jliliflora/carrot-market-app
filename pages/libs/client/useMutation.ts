// api로 data를 POST하기 위한 코드로 재활용이 가능하도록 만들었음
// 데이터를 서버로 전송하는 "mutation" 기능

import { useState } from "react";

interface UseMutationState<T> {
  loading: boolean;
  data?: T;
  error?: object;
}
// UseMutationResult의 data 타입을 any에서 T로 변경 => T는 useMutation 함수의 제네릭 타입으로, 데이터의 타입을 지정하는 역할을 하는데, T는 useMutation 함수에서 호출 시 명시된 타입에 따라 결정된다
type UseMutationResult<T> = [(data: T) => void, UseMutationState<T>];

// useMutation<T = any>에서 오류 발생, useMutation<T>로 변경! useMutation 함수의 제네릭 타입 T를 사용하여 반환값에 타입을 명확하게 지정
export default function useMutation<T>(url: string): UseMutationResult<T> {
  /*
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<undefined | any>(undefined);
    const [error, setError] = useState<undefined | any>(undefined);
  */

  // useState를 사용해 state 상태 변수를 정의하며, 초기값으로 loading: false, data: undefined, error: undefined로 설정!
  // setState 함수는 상태를 업데이트하는 데 사용되는 것
  const [state, setState] = useState<UseMutationState<T>>({
    loading: false,
    data: undefined,
    error: undefined,
  });

  // (data: any) 에러남 => // 제네릭 T를 사용하여 data 타입을 유연하게 설정
  function mutaton(data: T) {
    // setLoading(true);
    setState((prev) => ({ ...prev, loading: true }));
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }, //req.body.email을 받기 위해서 설정해주는 것
      body: JSON.stringify(data),
    })
      /*
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
    */
      .then((response) => response.json().catch(() => {})) // 챗지피티가 위에 걸로 고쳐보래;
      // .then(setData)
      .then((data) => setState((prev) => ({ ...prev, data })))
      // .catch(setError)
      .catch((error) => setState((prev) => ({ ...prev, error })))
      // .finally(() => setLoading(false));
      .finally(() => setState((prev) => ({ ...prev, loading: false })));
  }
  // return [mutaton, { loading, data, error }];
  return [mutaton, { ...state }]; //이게 얕은복사 방식이라 객체보호하기 좋은 방법
  // return [mutaton, state]; 챗지피티가 이거 추천함...
}

// prev의 역할
// setState 함수 내에서 prev는 이전 상태를 참조하는 매개변수로, 상태가 비동기적으로 업데이트될 때 이전 상태를 기반으로 다음 상태를 안전하게 업데이트할 수 있도록 합니다.

// prev를 사용하면 이전 상태를 유지하면서 변경된 속성만 업데이트할 수 있습니다. 예를 들어:
// loading만 true로 설정할 때, 나머지 상태(data와 error)는 이전 값 그대로 유지합니다.
// data가 업데이트될 때도 prev를 사용해 loading과 error를 그대로 두고 data만 업데이트합니다.
