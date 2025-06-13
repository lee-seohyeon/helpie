import { useState } from 'react';
import Head from 'next/head';
import DiceGame from '@/components/DiceGame';
import NumberPicker from '@/components/NumberPicker';
import LadderGame from '@/components/LadderGame';
import EmojiPicker from '@/components/EmojiPicker';
import { Dice1, Hash, GitBranch, Smile } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dice' | 'numbers' | 'ladder' | 'emoji'>('dice');

  return (
    <>
      <Head>
        <title>Helpie - 유용한 도구 모음</title>
        <meta name="description" content="주사위 굴리기, 랜덤 숫자 뽑기, 사다리타기 등 유용한 도구 모음" />
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
                    flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200
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
                    flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200
                    ${activeTab === 'numbers'
                      ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Hash className="w-5 h-5" />
                  랜덤 숫자
                </button>
                <button
                  onClick={() => setActiveTab('ladder')}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200
                    ${activeTab === 'ladder'
                      ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <GitBranch className="w-5 h-5" />
                  사다리 타기
                </button>
                <button
                  onClick={() => setActiveTab('emoji')}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200
                    ${activeTab === 'emoji'
                      ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Smile className="w-5 h-5" />
                  이모지
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
