import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface EmojiPickerProps {
  className?: string;
}

// 이모지 카테고리 정의
const emojiCategories = [
  {
    name: '표정',
    emojis: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯']
  },
  {
    name: '손동작',
    emojis: ['👋', '🤚', '✋', '🖐️', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏']
  },
  {
    name: '사람',
    emojis: ['👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👩‍🦱', '👨‍🦱', '👩‍🦰', '👨‍🦰', '👱‍♀️', '👱‍♂️', '👩‍🦳', '👨‍🦳', '👩‍🦲', '👨‍🦲', '🧔‍♀️', '🧔‍♂️', '👵', '🧓', '👴']
  },
  {
    name: '동물',
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇']
  },
  {
    name: '음식',
    emojis: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕', '🫖', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🍾', '🧊', '🥄', '🍴', '🍽️', '🥢', '🥡']
  },
  {
    name: '하트',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝']
  }
];

const EmojiPicker: React.FC<EmojiPickerProps> = ({ className }) => {
  const [activeCategory, setActiveCategory] = useState(emojiCategories[0].name);
  const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null);

  const handleEmojiClick = async (emoji: string) => {
    try {
      await navigator.clipboard.writeText(emoji);
      setCopiedEmoji(emoji);
      setTimeout(() => setCopiedEmoji(null), 1000);
    } catch (err) {
      console.error('이모지 복사 실패:', err);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="text-center mb-8 px-6 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 blur-3xl" />
        </div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 mb-2 tracking-tight">
          이모지 복사
        </h1>
        <p className="text-lg text-white/80">
          클릭하면 복사돼요!
        </p>
      </div>

      {/* Category Tabs */}
      <div className="mb-6">
        <div className="px-4">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {emojiCategories.map((category, index) => (
              <button
                key={`category-${index}`}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                onMouseUp={(e) => {
                  e.preventDefault();
                  handleCategoryClick(category.name);
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleCategoryClick(category.name);
                }}
                className={`
                  w-full h-12 rounded-lg font-medium text-sm transition-all duration-200
                  ${activeCategory === category.name
                    ? 'bg-yellow-400 text-black'
                    : 'bg-zinc-800 text-white hover:bg-zinc-700'
                  }
                `}
                style={{
                  zIndex: 10,
                  position: 'relative',
                  pointerEvents: 'auto'
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Emoji Grid */}
      <div className="relative bg-zinc-900/80 backdrop-blur-xl p-4 sm:p-6 rounded-3xl shadow-2xl border border-white/10"
           style={{
             boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 2px 10px rgba(255, 255, 255, 0.1)'
           }}>
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-4">
          {emojiCategories.find(c => c.name === activeCategory)?.emojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleEmojiClick(emoji)}
              className="relative group aspect-square rounded-2xl bg-zinc-800/50 hover:bg-zinc-700/50 border border-white/5 transition-all duration-200 hover:scale-105"
            >
              <span className="absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl">
                {emoji}
              </span>
              {copiedEmoji === emoji && (
                <div className="absolute inset-0 flex items-center justify-center bg-green-500/90 rounded-2xl">
                  <Check className="w-6 h-6 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmojiPicker; 