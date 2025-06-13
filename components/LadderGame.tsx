import React, { useState, useCallback } from 'react';
import { Plus, Minus, Play, Users, Gift, X, Edit3, UserCheck, RotateCw } from 'lucide-react';

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
  const [animationPath, setAnimationPath] = useState<{ level: number; position: number }[]>([]);

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
      setAnimationPath([]);
    }
  };

  const updateWinCount = (newCount: number) => {
    if (newCount >= 0 && newCount < participantCount && !isPlaying) {
      setWinCount(newCount);
      setLoseCount(participantCount - newCount);
      // 기존 결과 초기화
      setParticipants(prev => prev.map(p => ({ ...p, hasPlayed: false, result: undefined, isWin: undefined })));
      setLadderStructure(null);
      setAnimationPath([]);
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

  const simulateIndividualLadder = async (participantIndex: number) => {
    if (!ladderStructure) return;

    const structure = ladderStructure;
    let currentPosition = participantIndex;
    const path: { level: number; position: number }[] = [{ level: 0, position: currentPosition }];
    
    // 각 레벨을 내려가면서 사다리 확인 (정확한 알고리즘)
    for (let level = 0; level < structure.ladders.length; level++) {
      let newPosition = currentPosition;
      
      // 현재 위치에서 가로선 확인 (현재 위치 기준으로 오른쪽으로 가는 사다리)
      if (currentPosition < participantCount - 1 && structure.ladders[level][currentPosition]) {
        // 오른쪽으로 이동
        newPosition = currentPosition + 1;
      }
      // 현재 위치에서 왼쪽으로 가는 사다리 확인 (왼쪽 위치의 사다리가 현재 위치로 오는지)
      else if (currentPosition > 0 && structure.ladders[level][currentPosition - 1]) {
        // 왼쪽으로 이동
        newPosition = currentPosition - 1;
      }
      
      // 위치가 변경된 경우 (사다리 이동)
      if (newPosition !== currentPosition) {
        // 1단계: 가로 이동 표시
        const horizontalStep = { level: level, position: newPosition };
        const tempPath = [...path, horizontalStep];
        setAnimationPath(tempPath);
        await new Promise<void>(resolve => setTimeout(resolve, 250));
        currentPosition = newPosition;
      }
      
      // 2단계: 세로로 한 레벨 내려가기
      path.push({ level: level + 1, position: currentPosition });
      setAnimationPath([...path]);
      await new Promise<void>(resolve => setTimeout(resolve, 250));
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
    setAnimationPath([]);
    
    // 사다리 구조가 없으면 생성
    generateLadderStructure();
    
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    await simulateIndividualLadder(participantIndex);
    
    setIsPlaying(false);
    setCurrentPlayer(null);
  };

  const resetGame = () => {
    setParticipants(prev => prev.map(p => ({ ...p, hasPlayed: false, result: undefined, isWin: undefined })));
    setLadderStructure(null);
    setCurrentPlayer(null);
    setAnimationPath([]);
  };

  // SVG 사다리 렌더링
  const renderLadder = () => {
    if (!ladderStructure) {
      generateLadderStructure();
      return null;
    }

    const structure = ladderStructure;
    const width = 500;
    const height = 400;
    const startX = 60;
    const endX = width - 60;
    const spacing = (endX - startX) / (participantCount - 1);
    const levels = 8;
    const levelSpacing = (height - 120) / levels;

    return (
      <div className="relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-amber-500/5 blur-3xl" />
        
        <svg width={width} height={height} className="relative z-10">
          {/* 참가자 이름 */}
          {participants.map((participant, i) => (
            <text
              key={`name-${i}`}
              x={startX + i * spacing}
              y={25}
              textAnchor="middle"
              className="fill-yellow-400 text-sm font-bold"
              style={{ fontFamily: 'Pretendard, sans-serif' }}
            >
              {participant.name}
            </text>
          ))}

          {/* 결과 */}
          {structure.outcomes.map((outcome, i) => (
            <text
              key={`outcome-${i}`}
              x={startX + i * spacing}
              y={height - 15}
              textAnchor="middle"
              className={`text-sm font-bold ${outcome === '당첨' ? 'fill-green-400' : 'fill-red-400'}`}
              style={{ fontFamily: 'Pretendard, sans-serif' }}
            >
              {outcome}
            </text>
          ))}

          {/* 세로선 (참가자 라인) */}
          {Array.from({ length: participantCount }).map((_, i) => {
            const x = startX + i * spacing;
            const isCurrentPlayer = currentPlayer === i;
            return (
              <line
                key={`vertical-${i}`}
                x1={x}
                y1={40}
                x2={x}
                y2={height - 40}
                stroke={isCurrentPlayer ? "#fbbf24" : "#facc15"}
                strokeWidth={isCurrentPlayer ? "4" : "3"}
                className={isCurrentPlayer ? "drop-shadow-lg" : ""}
                style={{
                  filter: isCurrentPlayer ? 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))' : 'none'
                }}
              />
            );
          })}

          {/* 가로선 (사다리) */}
          {structure.ladders.map((levelLadders, level) => {
            const y = 70 + level * levelSpacing;
            return levelLadders.map((hasLadder, i) => {
              if (!hasLadder) return null;
              const x1 = startX + i * spacing;
              const x2 = startX + (i + 1) * spacing;
              return (
                <line
                  key={`ladder-${level}-${i}`}
                  x1={x1}
                  y1={y}
                  x2={x2}
                  y2={y}
                  stroke="#facc15"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="drop-shadow-sm"
                />
              );
            });
          })}

          {/* 애니메이션 경로 */}
          {animationPath.length > 1 && (
            <g>
              {animationPath.slice(0, -1).map((point, i) => {
                const nextPoint = animationPath[i + 1];
                const currentX = startX + point.position * spacing;
                const currentY = 70 + point.level * levelSpacing;
                const nextX = startX + nextPoint.position * spacing;
                const nextY = 70 + nextPoint.level * levelSpacing;

                if (point.position === nextPoint.position) {
                  // 세로 이동
                  return (
                    <line
                      key={`path-${i}`}
                      x1={currentX}
                      y1={currentY}
                      x2={nextX}
                      y2={nextY}
                      stroke="#ef4444"
                      strokeWidth="6"
                      strokeLinecap="round"
                      className="animate-pulse"
                      style={{
                        filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))'
                      }}
                    />
                  );
                } else {
                  // 가로 + 세로 이동
                  return (
                    <g key={`path-${i}`}>
                      <line
                        x1={currentX}
                        y1={currentY}
                        x2={nextX}
                        y2={currentY}
                        stroke="#ef4444"
                        strokeWidth="6"
                        strokeLinecap="round"
                        className="animate-pulse"
                        style={{
                          filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))'
                        }}
                      />
                      <line
                        x1={nextX}
                        y1={currentY}
                        x2={nextX}
                        y2={nextY}
                        stroke="#ef4444"
                        strokeWidth="6"
                        strokeLinecap="round"
                        className="animate-pulse"
                        style={{
                          filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))'
                        }}
                      />
                    </g>
                  );
                }
              })}
              
              {/* 현재 위치 표시 */}
              {animationPath.length > 0 && (
                <circle
                  cx={startX + animationPath[animationPath.length - 1].position * spacing}
                  cy={70 + animationPath[animationPath.length - 1].level * levelSpacing}
                  r="8"
                  fill="#ef4444"
                  className="animate-ping"
                  style={{
                    filter: 'drop-shadow(0 0 15px rgba(239, 68, 68, 1))'
                  }}
                />
              )}
            </g>
          )}
        </svg>

        {/* 플레이 중 오버레이 */}
        {isPlaying && currentPlayer !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-3xl backdrop-blur-sm">
            <div className="text-center p-6 rounded-2xl bg-zinc-900/90 border border-yellow-400/30">
              <div className="text-yellow-400 text-xl font-bold mb-2 animate-pulse">
                {participants[currentPlayer]?.name}님이 사다리를 타고 있습니다
              </div>
              <div className="flex items-center justify-center gap-2 text-yellow-300">
                <RotateCw className="w-5 h-5 animate-spin" />
                <span>두근두근...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

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
          두근두근 스릴 넘치는 사다리 게임! 🎯
        </p>
      </div>

      {/* Settings */}
      <div className="mb-6 space-y-4">
        {/* Participants */}
        <div className="flex justify-between items-center p-4 bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-white/10">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-yellow-400" />
            <span className="text-white text-sm font-medium">참가자</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => updateParticipantCount(participantCount - 1)}
              disabled={participantCount <= 2 || isPlaying}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-yellow-400 text-lg font-bold min-w-[60px] text-center">
              {participantCount}명
            </span>
            <button
              onClick={() => updateParticipantCount(participantCount + 1)}
              disabled={participantCount >= 10 || isPlaying}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Win Count */}
        <div className="flex justify-between items-center p-4 bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-white/10">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-green-400" />
            <span className="text-white text-sm font-medium">당첨</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => updateWinCount(winCount - 1)}
              disabled={winCount <= 0 || isPlaying}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-green-400 text-lg font-bold min-w-[60px] text-center">
              {winCount}개
            </span>
            <button
              onClick={() => updateWinCount(winCount + 1)}
              disabled={winCount >= participantCount - 1 || isPlaying}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lose Count */}
        <div className="flex justify-between items-center p-4 bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-white/10">
          <div className="flex items-center gap-2">
            <X className="w-5 h-5 text-red-400" />
            <span className="text-white text-sm font-medium">꽝</span>
          </div>
          <span className="text-red-400 text-lg font-bold">
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
            className="text-yellow-400 hover:text-yellow-300 disabled:opacity-50 transition-all duration-200 hover:scale-110"
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
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all duration-200"
                  placeholder={`참가자${participant.id}`}
                />
              ) : (
                <span className="flex-1 text-white text-sm font-medium px-3 py-2">{participant.name}</span>
              )}
              {participant.hasPlayed && (
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                  participant.isWin ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {participant.result}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Ladder Display */}
      {renderLadder()}

      {/* Individual Play Buttons */}
      <div className="mb-6 space-y-3">
        <h3 className="text-white text-lg font-bold text-center mb-4">개별 사다리타기</h3>
        <div className="grid grid-cols-2 gap-3">
          {participants.map((participant, participantIndex) => (
            <button
              key={participant.id}
              onClick={() => startIndividualGame(participantIndex)}
              disabled={isPlaying || participant.hasPlayed}
              className={`
                flex items-center justify-center gap-2 p-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95
                ${participant.hasPlayed
                  ? participant.isWin
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-lg shadow-green-500/10'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/10'
                  : isPlaying
                    ? 'bg-zinc-600/50 text-white/50 cursor-not-allowed border border-zinc-600/30'
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 shadow-lg shadow-yellow-500/10'
                }
              `}
            >
              {participant.hasPlayed ? (
                <UserCheck className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span className="font-bold">{participant.name}</span>
              {participant.hasPlayed && (
                <span className="text-xs opacity-80">({participant.result})</span>
              )}
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
            transition-all duration-300 transform active:scale-95 hover:scale-105
            text-black
            focus:outline-none focus:ring-4 focus:ring-yellow-300/50
            ${isPlaying 
              ? 'bg-zinc-600 cursor-not-allowed text-white' 
              : 'bg-gradient-to-br from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 shadow-lg shadow-yellow-500/25'
            }
          `}
        >
          <span className="absolute top-0.5 left-0.5 w-[calc(100%-4px)] h-[calc(100%-4px)] bg-yellow-400/20 rounded-full group-hover:bg-yellow-400/30 transition-colors"></span>
          <span className="relative flex items-center justify-center gap-2">
            <RotateCw className="w-4 h-4" />
            다시 시작
          </span>
        </button>
      </div>
    </div>
  );
};

export default LadderGame; 