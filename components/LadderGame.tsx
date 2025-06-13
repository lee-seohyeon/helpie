import React, { useState, useRef, useCallback } from 'react';
import { Plus, Minus, Play, Users, Gift, X, Edit3, UserCheck } from 'lucide-react';

interface LadderGameProps {
  className?: string;
}

interface Participant {
  id: number;
  name: string;
  result?: string;
  isWin?: boolean;
  hasPlayed: boolean;
}

interface LadderStructure {
  ladders: boolean[][];
  outcomes: string[];
}

const LadderGame: React.FC<LadderGameProps> = ({ className }) => {
  const [participantCount, setParticipantCount] = useState(4);
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 1, name: '참가자1', hasPlayed: false },
    { id: 2, name: '참가자2', hasPlayed: false },
    { id: 3, name: '참가자3', hasPlayed: false },
    { id: 4, name: '참가자4', hasPlayed: false }
  ]);
  const [winCount, setWinCount] = useState(1);
  const [loseCount, setLoseCount] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<number | null>(null);
  const [ladderStructure, setLadderStructure] = useState<LadderStructure | null>(null);
  const [isEditingNames, setIsEditingNames] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const updateParticipantCount = (newCount: number) => {
    if (newCount >= 2 && newCount <= 10 && !isPlaying) {
      setParticipantCount(newCount);
      setWinCount(Math.min(winCount, newCount - 1));
      setLoseCount(newCount - Math.min(winCount, newCount - 1));
      
      // 참가자 목록 업데이트
      const newParticipants: Participant[] = [];
      for (let i = 0; i < newCount; i++) {
        if (i < participants.length) {
          newParticipants.push({ ...participants[i], hasPlayed: false, result: undefined, isWin: undefined });
        } else {
          newParticipants.push({ id: i + 1, name: `참가자${i + 1}`, hasPlayed: false });
        }
      }
      setParticipants(newParticipants);
      setLadderStructure(null);
    }
  };

  const updateWinCount = (newCount: number) => {
    if (newCount >= 0 && newCount < participantCount && !isPlaying) {
      setWinCount(newCount);
      setLoseCount(participantCount - newCount);
      // 기존 결과 초기화
      setParticipants(prev => prev.map(p => ({ ...p, hasPlayed: false, result: undefined, isWin: undefined })));
      setLadderStructure(null);
    }
  };

  const updateParticipantName = (id: number, name: string) => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, name: name.trim() || `참가자${id}` } : p));
  };

  const generateLadderStructure = useCallback(() => {
    if (ladderStructure) return ladderStructure;

    const levels = 8;
    const ladders: boolean[][] = [];
    
    // 사다리 구조 생성
    for (let level = 0; level < levels; level++) {
      ladders[level] = [];
      for (let i = 0; i < participantCount - 1; i++) {
        ladders[level][i] = Math.random() > 0.5;
      }
    }

    // 결과 배열 생성
    const outcomes: string[] = [];
    for (let i = 0; i < winCount; i++) {
      outcomes.push('당첨');
    }
    for (let i = 0; i < loseCount; i++) {
      outcomes.push('꽝');
    }
    
    // 결과 섞기
    for (let i = outcomes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [outcomes[i], outcomes[j]] = [outcomes[j], outcomes[i]];
    }

    const structure = { ladders, outcomes };
    setLadderStructure(structure);
    return structure;
  }, [participantCount, winCount, loseCount, ladderStructure]);

  const drawLadder = useCallback((highlightPath?: { level: number; position: number }[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = 500;
    const height = canvas.height = 400;
    
    ctx.clearRect(0, 0, width, height);
    
    const startX = 60;
    const endX = width - 60;
    const spacing = (endX - startX) / (participantCount - 1);
    const levels = 8;
    const levelSpacing = (height - 120) / levels;

    const structure = generateLadderStructure();

    // 참가자 이름 그리기
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    for (let i = 0; i < participantCount; i++) {
      const x = startX + i * spacing;
      ctx.fillText(participants[i]?.name || `참가자${i + 1}`, x, 25);
    }

    // 결과 그리기
    ctx.font = 'bold 12px Arial';
    for (let i = 0; i < participantCount; i++) {
      const x = startX + i * spacing;
      const outcome = structure.outcomes[i];
      ctx.fillStyle = outcome === '당첨' ? '#22c55e' : '#ef4444';
      ctx.fillText(outcome, x, height - 15);
    }

    // 세로선 그리기
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    for (let i = 0; i < participantCount; i++) {
      const x = startX + i * spacing;
      ctx.beginPath();
      ctx.moveTo(x, 40);
      ctx.lineTo(x, height - 40);
      ctx.stroke();
    }

    // 가로선 (사다리) 그리기
    ctx.lineWidth = 2;
    for (let level = 0; level < levels; level++) {
      const y = 70 + level * levelSpacing;
      for (let i = 0; i < participantCount - 1; i++) {
        if (structure.ladders[level][i]) {
          const x1 = startX + i * spacing;
          const x2 = startX + (i + 1) * spacing;
          ctx.strokeStyle = '#facc15';
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.stroke();
        }
      }
    }

    // 경로 하이라이트
    if (highlightPath) {
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      
      for (let i = 0; i < highlightPath.length - 1; i++) {
        const current = highlightPath[i];
        const next = highlightPath[i + 1];
        
        const currentX = startX + current.position * spacing;
        const currentY = 70 + current.level * levelSpacing;
        const nextX = startX + next.position * spacing;
        const nextY = 70 + next.level * levelSpacing;
        
        ctx.beginPath();
        ctx.moveTo(currentX, currentY);
        ctx.lineTo(nextX, nextY);
        ctx.stroke();
      }
    }
  }, [participantCount, participants, generateLadderStructure]);

  const simulateIndividualLadder = async (participantIndex: number) => {
    if (!ladderStructure) return;

    const structure = ladderStructure;
    let currentPosition = participantIndex;
    const path: { level: number; position: number }[] = [{ level: 0, position: currentPosition }];
    
    // 각 레벨을 내려가면서 사다리 확인
    for (let level = 0; level < structure.ladders.length; level++) {
      // 왼쪽 사다리 확인
      if (currentPosition > 0 && structure.ladders[level][currentPosition - 1]) {
        currentPosition--;
      }
      // 오른쪽 사다리 확인
      else if (currentPosition < participantCount - 1 && structure.ladders[level][currentPosition]) {
        currentPosition++;
      }
      
      path.push({ level: level + 1, position: currentPosition });
      
      // 애니메이션으로 경로 그리기
      await new Promise<void>(resolve => {
        setTimeout(() => {
          drawLadder(path);
          resolve();
        }, 300);
      });
    }
    
    const result = structure.outcomes[currentPosition];
    const isWin = result === '당첨';
    
    // 참가자 결과 업데이트
    setParticipants(prev => prev.map(p => 
      p.id === participantIndex + 1 
        ? { ...p, result, isWin, hasPlayed: true }
        : p
    ));

    return { result, isWin };
  };

  const startIndividualGame = async (participantIndex: number) => {
    if (isPlaying || participants[participantIndex].hasPlayed) return;
    
    setIsPlaying(true);
    setCurrentPlayer(participantIndex);
    
    // 사다리 구조가 없으면 생성
    generateLadderStructure();
    drawLadder();
    
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
    await simulateIndividualLadder(participantIndex);
    
    setIsPlaying(false);
    setCurrentPlayer(null);
  };

  const resetGame = () => {
    setParticipants(prev => prev.map(p => ({ ...p, hasPlayed: false, result: undefined, isWin: undefined })));
    setLadderStructure(null);
    setCurrentPlayer(null);
    drawLadder();
  };

  // 초기 사다리 그리기
  React.useEffect(() => {
    if (canvasRef.current && !isPlaying) {
      drawLadder();
    }
  }, [participantCount, participants, winCount, loseCount, drawLadder, isPlaying]);

  return (
    <div className={className}>
      {/* Header */}
      <div className="text-center mb-8 px-6 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 blur-3xl" />
        </div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 mb-2 tracking-tight">
          사다리 타기
        </h1>
        <p className="text-lg text-white/80">
          두근두근!
        </p>
      </div>

      {/* Settings */}
      <div className="mb-6 space-y-4">
        {/* Participants */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-yellow-400" />
            <span className="text-white text-sm">참가자:</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => updateParticipantCount(participantCount - 1)}
              disabled={participantCount <= 2 || isPlaying}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-yellow-400 text-lg font-semibold min-w-[60px] text-center">
              {participantCount}명
            </span>
            <button
              onClick={() => updateParticipantCount(participantCount + 1)}
              disabled={participantCount >= 10 || isPlaying}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Win Count */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-green-400" />
            <span className="text-white text-sm">당첨:</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => updateWinCount(winCount - 1)}
              disabled={winCount <= 0 || isPlaying}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-green-400 text-lg font-semibold min-w-[60px] text-center">
              {winCount}개
            </span>
            <button
              onClick={() => updateWinCount(winCount + 1)}
              disabled={winCount >= participantCount - 1 || isPlaying}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lose Count */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <X className="w-5 h-5 text-red-400" />
            <span className="text-white text-sm">꽝:</span>
          </div>
          <span className="text-red-400 text-lg font-semibold">
            {loseCount}개
          </span>
        </div>
      </div>

      {/* Participant Names */}
      <div className="mb-6 bg-zinc-900/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white text-sm font-semibold">참가자 이름</h3>
          <button
            onClick={() => setIsEditingNames(!isEditingNames)}
            disabled={isPlaying}
            className="text-yellow-400 hover:text-yellow-300 disabled:opacity-50"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {participants.map((participant) => (
            <div key={participant.id} className="flex items-center gap-2">
              {isEditingNames ? (
                <input
                  type="text"
                  value={participant.name}
                  onChange={(e) => updateParticipantName(participant.id, e.target.value)}
                  className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                  placeholder={`참가자${participant.id}`}
                />
              ) : (
                <span className="flex-1 text-white text-sm">{participant.name}</span>
              )}
              {participant.hasPlayed && (
                <span className={`text-xs px-2 py-1 rounded ${
                  participant.isWin ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {participant.result}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Ladder Canvas */}
      <div className="relative bg-zinc-900/80 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-white/10 mb-6"
           style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 2px 10px rgba(255, 255, 255, 0.1)'
           }}>
        <canvas
          ref={canvasRef}
          className="w-full h-[400px] bg-transparent"
          style={{ imageRendering: 'crisp-edges' }}
        />
        
        {isPlaying && currentPlayer !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-3xl">
            <div className="text-yellow-400 text-xl font-semibold animate-pulse">
              {participants[currentPlayer]?.name}님이 사다리를 타고 있습니다...
            </div>
          </div>
        )}
      </div>

      {/* Individual Play Buttons */}
      <div className="mb-6 space-y-2">
        <h3 className="text-white text-lg font-semibold text-center mb-3">개별 사다리타기</h3>
        <div className="grid grid-cols-2 gap-3">
          {participants.map((participant, participantIndex) => (
            <button
              key={participant.id}
              onClick={() => startIndividualGame(participantIndex)}
              disabled={isPlaying || participant.hasPlayed}
              className={`
                flex items-center justify-center gap-2 p-3 rounded-xl font-medium transition-all duration-200
                ${participant.hasPlayed
                  ? participant.isWin
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : isPlaying
                    ? 'bg-zinc-600 text-white/50 cursor-not-allowed'
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30'
                }
              `}
            >
              {participant.hasPlayed ? (
                <UserCheck className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {participant.name}
              {participant.hasPlayed && ` (${participant.result})`}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <div className="text-center">
        <button
          onClick={resetGame}
          disabled={isPlaying}
          className={`
            relative group w-48 h-12 rounded-full font-bold text-sm
            transition-all duration-300 transform active:scale-95
            text-black
            focus:outline-none focus:ring-4 focus:ring-yellow-300/50
            ${isPlaying 
              ? 'bg-zinc-600 cursor-not-allowed text-white' 
              : 'bg-gradient-to-br from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600'
            }
          `}
        >
          <span className="absolute top-0.5 left-0.5 w-[calc(100%-4px)] h-[calc(100%-4px)] bg-yellow-400/20 rounded-full group-hover:bg-yellow-400/30 transition-colors"></span>
          <span className="relative">
            다시 시작
          </span>
        </button>
      </div>
    </div>
  );
};

export default LadderGame; 