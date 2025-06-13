import React, { useState } from 'react';
import { RefreshCw, Plus, Minus } from 'lucide-react';

interface NumberPickerProps {
  className?: string;
}

const NumberPicker: React.FC<NumberPickerProps> = ({ className }) => {
  const [minNumber, setMinNumber] = useState(1);
  const [maxNumber, setMaxNumber] = useState(100);
  const [count, setCount] = useState(1);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNumbers = () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setNumbers([]);

    // 애니메이션을 위한 임시 숫자들 생성
    const tempInterval = setInterval(() => {
      const tempNums = Array(count).fill(0).map(() => 
        Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber
      );
      setNumbers(tempNums);
    }, 50);

    // 최종 숫자 생성
    setTimeout(() => {
      clearInterval(tempInterval);
      setIsGenerating(false);
      
      // 중복 없는 숫자 생성
      const newNumbers = new Set<number>();
      while (newNumbers.size < count) {
        newNumbers.add(Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber);
      }
      setNumbers(Array.from(newNumbers));
    }, 1000);
  };

  const updateCount = (newCount: number) => {
    if (newCount >= 1 && newCount <= 10 && !isGenerating) {
      setCount(newCount);
      setNumbers([]);
    }
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="text-center mb-8 px-6 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 blur-3xl" />
        </div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 mb-2 tracking-tight">
          랜덤 숫자 뽑기
        </h1>
        <p className="text-lg text-white/80">
          두근두근!
        </p>
      </div>

      {/* Number Range Inputs */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <label className="text-white text-base sm:text-lg font-medium">최소값:</label>
          <input
            type="number"
            value={minNumber}
            onChange={(e) => setMinNumber(Math.min(parseInt(e.target.value) || 1, maxNumber - 1))}
            className="w-24 px-3 py-2 bg-zinc-900/80 border border-white/10 rounded-lg text-white text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            disabled={isGenerating}
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <label className="text-white text-base sm:text-lg font-medium">최대값:</label>
          <input
            type="number"
            value={maxNumber}
            onChange={(e) => setMaxNumber(Math.max(parseInt(e.target.value) || minNumber + 1, minNumber + 1))}
            className="w-24 px-3 py-2 bg-zinc-900/80 border border-white/10 rounded-lg text-white text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            disabled={isGenerating}
          />
        </div>
      </div>

      {/* Number Count Selector */}
      <div className="mb-6 flex justify-center items-center gap-4">
        <button
          onClick={() => updateCount(count - 1)}
          disabled={count <= 1 || isGenerating}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="text-yellow-400 text-lg font-semibold">
          {count}개 뽑기
        </div>
        <button
          onClick={() => updateCount(count + 1)}
          disabled={count >= 10 || isGenerating || count >= (maxNumber - minNumber + 1)}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Numbers Display */}
      <div className="relative bg-zinc-900/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/10 min-h-[120px]"
           style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 2px 10px rgba(255, 255, 255, 0.1)'
           }}>
        <div className="flex flex-wrap justify-center gap-4">
          {numbers.map((number, index) => (
            <div
              key={index}
              className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 text-black font-bold text-xl shadow-lg"
            >
              {number}
            </div>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="mt-8 text-center">
        <button
          onClick={generateNumbers}
          disabled={isGenerating}
          className={`
            relative group w-48 h-16 rounded-full font-bold text-lg
            transition-all duration-300 transform active:scale-95
            text-black
            focus:outline-none focus:ring-4 focus:ring-yellow-300/50
            ${isGenerating 
              ? 'bg-zinc-600 cursor-not-allowed text-white' 
              : 'bg-gradient-to-br from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600'
            }
          `}
        >
          <span className="absolute top-0.5 left-0.5 w-[calc(100%-4px)] h-[calc(100%-4px)] bg-yellow-400/20 rounded-full group-hover:bg-yellow-400/30 transition-colors"></span>
          <span className="relative flex items-center justify-center gap-3">
            <RefreshCw className={`w-6 h-6 ${isGenerating ? 'animate-spin-slow' : ''}`} />
            {isGenerating ? 'Generating...' : 'Generate'}
          </span>
          <span 
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-black/30 rounded-full blur-md"
          ></span>
        </button>
      </div>
    </div>
  );
};

export default NumberPicker; 