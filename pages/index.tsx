import { useState } from 'react';
import Head from 'next/head';
import DiceGame from '@/components/DiceGame';
import NumberPicker from '@/components/NumberPicker';
import { Dice1, Hash } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dice' | 'numbers'>('dice');

  return (
    <>
      <Head>
        <title>Helpie - 유용한 도구 모음</title>
        <meta name="description" content="주사위 굴리기, 랜덤 숫자 뽑기 등 유용한 도구 모음" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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
                  onClick={() => setActiveTab('dice')}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
                    ${activeTab === 'dice'
                      ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Dice1 className="w-5 h-5" />
                  주사위
                </button>
                <button
                  onClick={() => setActiveTab('numbers')}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
                    ${activeTab === 'numbers'
                      ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Hash className="w-5 h-5" />
                  랜덤 숫자
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="relative w-full max-w-2xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
            {/* Tab Content */}
            <div className="relative">
              <div className={`transition-all duration-300 ${activeTab === 'dice' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 absolute inset-0 pointer-events-none'}`}>
                <DiceGame />
              </div>
              <div className={`transition-all duration-300 ${activeTab === 'numbers' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute inset-0 pointer-events-none'}`}>
                <NumberPicker />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
