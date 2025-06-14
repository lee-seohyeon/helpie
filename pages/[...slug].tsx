import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Home from './index';

export default function CatchAllRoute() {
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug && Array.isArray(slug)) {
      const path = slug[0];
      if (['dice', 'numbers', 'ladder', 'emoji'].includes(path)) {
        // 유효한 탭이면 쿼리 파라미터로 변환하여 메인 페이지에서 처리하도록 함
        router.replace(`/?tab=${path}`, `/${path}`, { shallow: true });
      } else {
        // 유효하지 않은 경로면 메인 페이지로 리다이렉트
        router.replace('/');
      }
    }
  }, [slug, router]);

  // 메인 페이지 컴포넌트를 렌더링
  return <Home />;
} 