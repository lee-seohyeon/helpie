import React, { useState } from 'react';
import Dice from './Dice';
import { Plus, Minus, RefreshCw } from 'lucide-react';
import { Meteors } from "@/components/magicui/meteors";

interface DiceGameProps {
  className?: string;
}

const DiceGame: React.FC<DiceGameProps> = ({ className }) => {
  const [diceCount, setDiceCount] = useState(3);
  const [diceValues, setDiceValues] = useState<number[]>(Array(diceCount).fill(1));
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    setDiceValues([]);

    // 애니메이션을 위한 임시 주사위 값들 생성
    const rollInterval = setInterval(() => {
      const tempValues = Array(diceCount).fill(0).map(() => Math.floor(Math.random() * 6) + 1);
      setDiceValues(tempValues);
    }, 50);

    // 최종 주사위 값 생성
    setTimeout(() => {
      clearInterval(rollInterval);
      const finalValues = Array(diceCount).fill(0).map(() => Math.floor(Math.random() * 6) + 1);
      setDiceValues(finalValues);
      setIsRolling(false);
    }, 1000);
  };

  const updateDiceCount = (newCount: number) => {
    if (newCount >= 1 && newCount <= 10 && !isRolling) {
      setDiceCount(newCount);
      setDiceValues(Array(newCount).fill(1));
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
          주사위를 굴려보세요
        </h1>
        <p className="text-lg text-white/80">
          두근두근!
        </p>
      </div>

      {/* Dice Count Controls */}
      <div className="mb-6 flex justify-center items-center gap-4">
        <button
          onClick={() => updateDiceCount(diceCount - 1)}
          disabled={diceCount <= 1 || isRolling}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="text-yellow-400 text-lg font-semibold">
          주사위 {diceCount}개
        </div>
        <button
          onClick={() => updateDiceCount(diceCount + 1)}
          disabled={diceCount >= 10 || isRolling}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Dice Display */}
      <div className="relative bg-zinc-900/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/10 min-h-[120px]"
           style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 2px 10px rgba(255, 255, 255, 0.1)'
           }}>
        <div className="flex flex-wrap justify-center gap-4">
          {diceValues.map((value, index) => (
            <Dice key={index} value={value} isRolling={isRolling} />
          ))}
        </div>
      </div>

      {/* Roll Button */}
      <div className="mt-8 text-center">
        <button
          onClick={rollDice}
          disabled={isRolling}
          className={`
            relative group w-48 h-16 rounded-full font-bold text-lg
            transition-all duration-300 transform active:scale-95
            text-black
            focus:outline-none focus:ring-4 focus:ring-yellow-300/50
            ${isRolling 
              ? 'bg-zinc-600 cursor-not-allowed text-white' 
              : 'bg-gradient-to-br from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600'
            }
          `}
        >
          <span className="absolute top-0.5 left-0.5 w-[calc(100%-4px)] h-[calc(100%-4px)] bg-yellow-400/20 rounded-full group-hover:bg-yellow-400/30 transition-colors"></span>
          <span className="relative flex items-center justify-center gap-3">
            <RefreshCw className={`w-6 h-6 ${isRolling ? 'animate-spin-slow' : ''}`} />
            {isRolling ? 'Rolling...' : 'Roll Dices'}
          </span>
          <span 
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-black/30 rounded-full blur-md"
          ></span>
        </button>
      </div>
    </div>
  );
};

export default DiceGame; 