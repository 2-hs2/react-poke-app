import { useEffect, useState } from 'react';

function LazyImage({ url, alt }) {
  const [isLoading, setIsLoading] = useState(true);
  const [opacity, setOpacity] = useState('opacity-0');

  useEffect(() => {
    isLoading ? setOpacity('opacity-0') : setOpacity('opacity-100');
  }, [isLoading]); // isLoading 바뀔 때마다 opacity 값 변경해야 하므로

  return (
    <>
      {/* 로딩 전 보여주는 부분 */}
      {isLoading && (
        <div className="absolute h-full z-10 w-full flex items-center justify-center">
          ...loading
        </div>
      )}
      <img
        src={url}
        alt={alt}
        width="100%"
        height="auto"
        loading="lazy" // image lazy loading
        onLoad={() => setIsLoading(false)} // 로드가 되면 isLoading state를 false로 변경해 로딩 전 보여주는 부분을 없앰
        className={`object-contain h-full ${opacity}`}
      />
    </>
  );
}

export default LazyImage;
