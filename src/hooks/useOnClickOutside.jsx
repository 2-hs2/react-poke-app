import { useEffect } from 'react';

/*
  ref: 모달 영역 외부와 내부를 구분지어줄 요소
  handler: setIsModal -> 모달창 닫고 여는 state
*/
export default function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      /* 모달 안을 클릭했는지
       * !ref.current의 경우 현재 ref에 들어온 값이 없는 경우
       *  event.target의 경우 현재 클릭하는 요소를 가져와줌
       * ref.current.contains(event.target)의 경우 현재 클릭한 요소가 ref.current에 속하는지 확인
       */
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      // 모달 밖을 클릭했는지
      handler();
    };
    document.addEventListener('mousedown', listener);

    // 해당 컴포넌트가 언마운트 되는 경우 실행
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, handler]);
}
