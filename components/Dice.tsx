import React from 'react';

interface DiceProps {
  value: number;
  isRolling: boolean;
}

const Dice: React.FC<DiceProps> = ({ value, isRolling }) => {
  const getDotPositions = (num: number) => {
    const dots = [];
    const dotStyle = "w-2.5 h-2.5 bg-black rounded-full shadow-inner";
    
    switch (num) {
      case 1:
        dots.push(<div key="center" className={`${dotStyle} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`} />);
        break;
      case 2:
        dots.push(<div key="tl" className={`${dotStyle} absolute top-2 left-2`} />);
        dots.push(<div key="br" className={`${dotStyle} absolute bottom-2 right-2`} />);
        break;
      case 3:
        dots.push(<div key="tl" className={`${dotStyle} absolute top-2 left-2`} />);
        dots.push(<div key="center" className={`${dotStyle} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`} />);
        dots.push(<div key="br" className={`${dotStyle} absolute bottom-2 right-2`} />);
        break;
      case 4:
        dots.push(<div key="tl" className={`${dotStyle} absolute top-2 left-2`} />);
        dots.push(<div key="tr" className={`${dotStyle} absolute top-2 right-2`} />);
        dots.push(<div key="bl" className={`${dotStyle} absolute bottom-2 left-2`} />);
        dots.push(<div key="br" className={`${dotStyle} absolute bottom-2 right-2`} />);
        break;
      case 5:
        dots.push(<div key="tl" className={`${dotStyle} absolute top-2 left-2`} />);
        dots.push(<div key="tr" className={`${dotStyle} absolute top-2 right-2`} />);
        dots.push(<div key="center" className={`${dotStyle} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`} />);
        dots.push(<div key="bl" className={`${dotStyle} absolute bottom-2 left-2`} />);
        dots.push(<div key="br" className={`${dotStyle} absolute bottom-2 right-2`} />);
        break;
      case 6:
        dots.push(<div key="tl" className={`${dotStyle} absolute top-2 left-2`} />);
        dots.push(<div key="tr" className={`${dotStyle} absolute top-2 right-2`} />);
        dots.push(<div key="ml" className={`${dotStyle} absolute top-1/2 left-2 transform -translate-y-1/2`} />);
        dots.push(<div key="mr" className={`${dotStyle} absolute top-1/2 right-2 transform -translate-y-1/2`} />);
        dots.push(<div key="bl" className={`${dotStyle} absolute bottom-2 left-2`} />);
        dots.push(<div key="br" className={`${dotStyle} absolute bottom-2 right-2`} />);
        break;
      default:
        break;
    }
    
    return dots;
  };

  return (
    <div className="relative group">
      {/* Shadow */}
      <div className="absolute top-2 left-2 w-16 h-16 bg-black/20 rounded-2xl blur-md"></div>
      
      {/* Dice */}
      <div 
        className={`
          relative w-16 h-16 rounded-2xl shadow-xl relative
          bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500
          border border-yellow-200/50
          ${isRolling ? 'animate-spin' : ''}
          transition-all duration-300 hover:scale-105 active:scale-95
          hover:shadow-2xl
          before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/30 before:to-transparent before:opacity-60
        `}
        style={{
          transform: isRolling ? 'rotateX(360deg) rotateY(360deg)' : 'rotateX(0deg) rotateY(0deg)',
        }}
      >
        {getDotPositions(value)}
        
        {/* Highlight */}
        <div className="absolute top-1 left-1 w-3 h-3 bg-white/40 rounded-full blur-sm"></div>
      </div>
    </div>
  );
};

export default Dice; 