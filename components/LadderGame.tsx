import React, { useState, useCallback, useEffect } from 'react';
import { Plus, Minus, Users, Gift, X, Edit3, RotateCw } from 'lucide-react';

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
  const [isClient, setIsClient] = useState(false);

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
      ladders[level] = Array(participantCount - 1).fill(false);
      
      // 각 레벨에서 하나의 가로선만 생성
      const possiblePositions = Array.from({ length: participantCount - 1 }, (_, i) => i)
        .filter(pos => {
          // 이전 레벨에서 연결된 위치는 제외
          if (level > 0 && ladders[level - 1][pos]) return false;
          if (level > 0 && pos > 0 && ladders[level - 1][pos - 1]) return false;
          return true;
        });

      if (possiblePositions.length > 0) {
        // 가능한 위치 중 하나를 랜덤하게 선택
        const randomIndex = Math.floor(Math.random() * possiblePositions.length);
        const selectedPosition = possiblePositions[randomIndex];
        ladders[level][selectedPosition] = true;
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
    
    // 각 레벨을 내려가면서 사다리 확인
    for (let level = 0; level < structure.ladders.length; level++) {
      let newPosition = currentPosition;
      
      // 현재 위치에서 가로선 확인
      if (currentPosition < participantCount - 1 && structure.ladders[level][currentPosition]) {
        // 오른쪽으로 이동
        path.push({ level: level, position: currentPosition + 1 });
        await new Promise<void>(resolve => setTimeout(resolve, 250));
        setAnimationPath([...path]);
        newPosition = currentPosition + 1;
      }
      // 왼쪽에서 오는 사다리 확인
      else if (currentPosition > 0 && structure.ladders[level][currentPosition - 1]) {
        // 왼쪽으로 이동
        path.push({ level: level, position: currentPosition - 1 });
        await new Promise<void>(resolve => setTimeout(resolve, 250));
        setAnimationPath([...path]);
        newPosition = currentPosition - 1;
      }
      
      // 아래로 이동
      path.push({ level: level + 1, position: newPosition });
      setAnimationPath([...path]);
      await new Promise<void>(resolve => setTimeout(resolve, 250));
      currentPosition = newPosition;
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

  // 클라이언트에서만 실행되도록 보장
  useEffect(() => {
    setIsClient(true);
  }, []);

  // SVG 사다리 렌더링
  const renderLadder = () => {
    // 클라이언트가 아니면 로딩 표시
    if (!isClient) {
      return (
        <div className="relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 backdrop-blur-xl p-4 sm:p-6 rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-amber-500/5 blur-3xl" />
          <div className="flex items-center justify-center h-[300px] sm:h-[400px]">
            <div className="text-center">
              <RotateCw className="w-8 h-8 text-yellow-400 animate-spin mx-auto mb-3" />
              <div className="text-yellow-400 text-lg font-bold">사다리 준비 중...</div>
            </div>
          </div>
        </div>
      );
    }

    if (!ladderStructure) {
      generateLadderStructure();
      return null;
    }

    const structure = ladderStructure;
    
    // 모바일 친화적인 크기 계산
    const isMobile = window.innerWidth < 640;
    
    // 참가자 수에 따른 최적 간격 계산
    const minSpacing = isMobile ? 45 : 60; // 최소 간격 (더 넉넉하게)
    const sideMargin = isMobile ? 30 : 50; // 좌우 여백 (더 넉넉하게)
    
    // 필요한 최소 너비 계산
    const requiredWidth = (minSpacing * (participantCount - 1)) + (sideMargin * 2);
    
    // 실제 사용할 크기
    const actualWidth = Math.max(requiredWidth, isMobile ? 320 : 500);
    const spacing = (actualWidth - (sideMargin * 2)) / (participantCount - 1);
    const startX = sideMargin;
    
    // 높이는 화면 크기에 따라 동적 조정
    const maxHeight = isMobile ? Math.min(window.innerHeight * 0.5, 300) : 400;
    const height = Math.max(250, maxHeight);
    
    const levels = 8;
    const levelSpacing = (height - 100) / levels;

    return (
      <div className="relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 backdrop-blur-xl p-2 sm:p-4 rounded-3xl shadow-2xl border border-white/10">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-amber-500/5 blur-3xl" />
        
        {/* 스크롤 가능한 컨테이너 */}
        <div className="overflow-x-auto overflow-y-hidden pb-2">
          <div style={{ width: actualWidth, margin: '0 auto' }}>
            <svg width={actualWidth} height={height} className="relative z-10 block">
          {/* 참가자 이름 */}
          {participants.map((participant, i) => (
            <g key={`name-${i}`}>
              {isEditingNames ? (
                <foreignObject
                  x={startX + i * spacing - spacing * 0.5}
                  y={5}
                  width={spacing}
                  height="50"
                >
                  <div className="flex flex-col items-center gap-1">
                    <input
                      type="text"
                      value={participant.name}
                      onChange={(e) => updateParticipantName(participant.id, e.target.value)}
                      className="w-full px-1 py-0.5 text-center bg-zinc-800/50 border border-yellow-400/30 rounded text-yellow-400 focus:outline-none focus:border-yellow-400"
                      style={{ fontFamily: 'Pretendard, sans-serif', fontSize: Math.min(10, Math.max(8, spacing * 0.18)) + 'px' }}
                    />
                    <button
                      onClick={() => setIsEditingNames(false)}
                      className="px-1 py-0.5 rounded font-medium bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-all"
                      style={{ fontSize: Math.min(8, Math.max(6, spacing * 0.12)) + 'px' }}
                    >
                      완료
                    </button>
                  </div>
                </foreignObject>
              ) : (
                <foreignObject
                  x={startX + i * spacing - spacing * 0.5}
                  y={5}
                  width={spacing}
                  height="50"
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center justify-center gap-1 group cursor-pointer w-full" onClick={() => !isPlaying && setIsEditingNames(true)}>
                      <span className="text-yellow-400 font-bold group-hover:text-yellow-300 text-center block" style={{ fontSize: Math.min(12, Math.max(8, spacing * 0.2)) + 'px', maxWidth: (spacing * 0.8) + 'px', wordBreak: 'break-all', lineHeight: '1.1' }}>
                        {participant.name}
                      </span>
                      <Edit3 className={`text-yellow-400/0 group-hover:text-yellow-400/50 transition-all flex-shrink-0 ${isPlaying ? 'cursor-not-allowed opacity-50' : ''}`} style={{ width: Math.min(10, spacing * 0.15) + 'px', height: Math.min(10, spacing * 0.15) + 'px' }} />
                    </div>
                                          <button
                        onClick={() => !isPlaying && !participant.hasPlayed && startIndividualGame(i)}
                        disabled={isPlaying || participant.hasPlayed}
                        className={`px-1 py-0.5 rounded font-medium transition-all ${
                          participant.hasPlayed
                            ? participant.isWin
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                        } disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap`}
                        style={{ fontSize: Math.min(10, Math.max(6, spacing * 0.15)) + 'px', padding: '2px ' + Math.min(6, spacing * 0.1) + 'px' }}
                      >
                      {participant.hasPlayed
                        ? participant.isWin
                          ? '당첨!'
                          : '꽝...'
                        : '시작'}
                    </button>
                  </div>
                </foreignObject>
              )}
            </g>
          ))}

          {/* 결과 */}
          {structure.outcomes.map((outcome, i) => (
            <text
              key={`outcome-${i}`}
              x={startX + i * spacing}
              y={height - 15}
              textAnchor="middle"
              className={`text-[10px] sm:text-sm font-bold ${outcome === '당첨' ? 'fill-green-400' : 'fill-red-400'}`}
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

                if (point.level === nextPoint.level) {
                  // 가로 이동
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
                }
              })}
            </g>
          )}
            </svg>
          </div>
        </div>

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
          두근두근!
        </p>
      </div>

      {/* Settings */}
      <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-4 px-4">
        {/* Participants */}
        <div className="flex flex-col p-2 sm:p-4 bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-white/10">
          <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            <span className="text-white text-xs sm:text-sm font-medium">참가자</span>
          </div>
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <button
              onClick={() => updateParticipantCount(participantCount - 1)}
              disabled={participantCount <= 2 || isPlaying}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex-shrink-0"
            >
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <span className="text-yellow-400 text-sm sm:text-lg font-bold min-w-[30px] sm:min-w-[60px] text-center">
              {participantCount}명
            </span>
            <button
              onClick={() => updateParticipantCount(participantCount + 1)}
              disabled={participantCount >= 10 || isPlaying}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex-shrink-0"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Win Count */}
        <div className="flex flex-col p-2 sm:p-4 bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-white/10">
          <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
            <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
            <span className="text-white text-xs sm:text-sm font-medium">당첨</span>
          </div>
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <button
              onClick={() => updateWinCount(winCount - 1)}
              disabled={winCount <= 0 || isPlaying}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex-shrink-0"
            >
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <span className="text-green-400 text-sm sm:text-lg font-bold min-w-[30px] sm:min-w-[60px] text-center">
              {winCount}개
            </span>
            <button
              onClick={() => updateWinCount(winCount + 1)}
              disabled={winCount >= participantCount - 1 || isPlaying}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex-shrink-0"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Lose Count */}
        <div className="flex flex-col p-2 sm:p-4 bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-white/10">
          <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            <span className="text-white text-xs sm:text-sm font-medium">꽝</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-red-400 text-sm sm:text-lg font-bold min-w-[30px] sm:min-w-[60px] text-center">
              {loseCount}개
            </span>
          </div>
        </div>
      </div>

      {/* Ladder Display */}
      <div className="px-2 sm:px-4">
        {renderLadder()}
      </div>

      {/* Individual Play Buttons */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={resetGame}
          disabled={isPlaying || !participants.some(p => p.hasPlayed)}
          className="px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 text-sm font-medium"
        >
          <RotateCw className="w-4 h-4" />
          다시하기
        </button>
      </div>
    </div>
  );
};

export default LadderGame; 