import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DiceGame from '@/components/DiceGame';
import NumberPicker from '@/components/NumberPicker';
import LadderGame from '@/components/LadderGame';
import EmojiPicker from '@/components/EmojiPicker';
import { Dice1, Hash, GitBranch, Smile } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dice' | 'numbers' | 'ladder' | 'emoji'>('dice');

  // URL에서 탭 상태 읽기 및 설정
  useEffect(() => {
    // 쿼리 파라미터에서 탭 확인
    const { tab } = router.query;
    if (tab && ['dice', 'numbers', 'ladder', 'emoji'].includes(tab as string)) {
      setActiveTab(tab as 'dice' | 'numbers' | 'ladder' | 'emoji');
      return;
    }

    // 경로에서 탭 확인
    const path = router.asPath.replace('/', '');
    if (path && ['dice', 'numbers', 'ladder', 'emoji'].includes(path)) {
      setActiveTab(path as 'dice' | 'numbers' | 'ladder' | 'emoji');
      return;
    }

    // 둘 다 없으면 localStorage에서 복원
    if (!tab && !path) {
      const savedTab = localStorage.getItem('activeTab') as 'dice' | 'numbers' | 'ladder' | 'emoji';
      if (savedTab && ['dice', 'numbers', 'ladder', 'emoji'].includes(savedTab)) {
        setActiveTab(savedTab);
        // URL도 업데이트
        router.replace(`/${savedTab}`, undefined, { shallow: true });
      } else {
        // 기본값으로 dice 설정
        router.replace('/dice', undefined, { shallow: true });
      }
    }
  }, [router.query, router.asPath, router]);

  // 탭 변경 시 URL과 localStorage 업데이트
  const handleTabChange = (tab: 'dice' | 'numbers' | 'ladder' | 'emoji') => {
    setActiveTab(tab);
    localStorage.setItem('activeTab', tab);
    router.push(`/${tab}`, undefined, { shallow: true });
  };

  // 현재 탭에 따른 동적 메타 데이터
  const getTabMetadata = () => {
    switch (activeTab) {
      case 'dice':
        return {
          title: 'Helpie - 온라인 주사위 굴리기',
          description: '온라인에서 무료로 사용할 수 있는 주사위 굴리기 도구. 1개부터 6개까지 주사위를 굴려보세요.',
          url: 'https://helpie.vercel.app/dice'
        };
      case 'numbers':
        return {
          title: 'Helpie - 랜덤 숫자 생성기',
          description: '원하는 범위의 랜덤 숫자를 생성하는 무료 온라인 도구. 최소값과 최대값을 설정하여 랜덤 숫자를 뽑아보세요.',
          url: 'https://helpie.vercel.app/numbers'
        };
      case 'ladder':
        return {
          title: 'Helpie - 온라인 사다리타기 게임',
          description: '온라인에서 무료로 즐길 수 있는 사다리타기 게임. 참가자와 결과를 설정하고 공정한 추첨을 해보세요.',
          url: 'https://helpie.vercel.app/ladder'
        };
      case 'emoji':
        return {
          title: 'Helpie - 이모지 복사 도구',
          description: '다양한 이모지를 쉽게 복사할 수 있는 무료 온라인 도구. 표정, 손동작, 동물, 음식 등 카테고리별 이모지 제공.',
          url: 'https://helpie.vercel.app/emoji'
        };
      default:
        return {
          title: 'Helpie - 주사위, 랜덤 숫자, 사다리타기, 이모지 도구',
          description: '온라인에서 무료로 사용할 수 있는 주사위 굴리기, 랜덤 숫자 뽑기, 사다리타기 게임, 이모지 복사 도구. 모바일과 PC에서 모두 사용 가능한 유용한 웹 도구 모음입니다.',
          url: 'https://helpie.vercel.app'
        };
    }
  };

  const metadata = getTabMetadata();

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content="주사위, 랜덤 숫자, 사다리타기, 이모지, 온라인 도구, 무료 도구, 웹 게임, 랜덤 생성기, 사다리 게임, 이모지 복사" />
        <meta name="author" content="Helpie" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={metadata.url} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={metadata.url} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:site_name" content="Helpie" />
        <meta property="og:locale" content="ko_KR" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={metadata.url} />
        <meta property="twitter:title" content={metadata.title} />
        <meta property="twitter:description" content={metadata.description} />
        
        {/* Additional SEO */}
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Helpie" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Helpie",
              "description": metadata.description,
              "url": metadata.url,
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "KRW"
              },
              "featureList": [
                "주사위 굴리기",
                "랜덤 숫자 생성",
                "사다리타기 게임",
                "이모지 복사 도구"
              ],
              "inLanguage": "ko-KR",
              "browserRequirements": "Requires JavaScript. Requires HTML5.",
              "softwareVersion": "1.0",
              "author": {
                "@type": "Organization",
                "name": "Helpie"
              }
            })
          }}
        />
      </Head>

      <main className="min-h-screen bg-black overflow-hidden relative">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black" />
        <div className="fixed inset-0 bg-[url('/grid.svg')] bg-repeat [mask-image:radial-gradient(white,transparent_85%)] opacity-20" />

        {/* Tab Navigation - Fixed at top */}
        <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex justify-center py-4">
            <div className="bg-zinc-900/80 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-xl">
              <div className="flex gap-2">
                <button
                  onClick={() => handleTabChange('dice')}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200
                    ${activeTab === 'dice'
                      ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Dice1 className="w-5 h-5" />
                  <span className="hidden sm:inline">주사위</span>
                </button>
                <button
                  onClick={() => handleTabChange('numbers')}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200
                    ${activeTab === 'numbers'
                      ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Hash className="w-5 h-5" />
                  <span className="hidden sm:inline">랜덤 숫자</span>
                </button>
                <button
                  onClick={() => handleTabChange('ladder')}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200
                    ${activeTab === 'ladder'
                      ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <GitBranch className="w-5 h-5" />
                  <span className="hidden sm:inline">사다리 타기</span>
                </button>
                <button
                  onClick={() => handleTabChange('emoji')}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200
                    ${activeTab === 'emoji'
                      ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Smile className="w-5 h-5" />
                  <span className="hidden sm:inline">이모지</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          {activeTab === 'dice' && <DiceGame className="max-w-2xl mx-auto" />}
          {activeTab === 'numbers' && <NumberPicker className="max-w-2xl mx-auto" />}
          {activeTab === 'ladder' && <LadderGame className="max-w-4xl mx-auto" />}
          {activeTab === 'emoji' && <EmojiPicker className="max-w-4xl mx-auto" />}
        </div>
      </main>
    </>
  );
}
