import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BreathingTypewriterProps {
  text: string;
  baseSpeed?: number;
  highlightSpeed?: number;
  sentencePause?: number;
  paragraphPause?: number;
  onComplete?: () => void;
  className?: string;
}

interface Sentence {
  text: string;
  animIndex: number;
}

interface Paragraph {
  sentences: Sentence[];
}

const HIGHLIGHT_CHARS = new Set([
  '火', '木', '土', '金', '水',
  '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸',
  '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥',
]);

function splitIntoParagraphs(text: string): Paragraph[] {
  const rawParagraphs = text.split(/\n\n+/);
  return rawParagraphs
    .map((para) => {
      const sentenceRegex = /[^。！？\n]+[。！？]?/g;
      const matches = para.match(sentenceRegex) || [];
      const sentences: Sentence[] = matches
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s, i) => ({ text: s, animIndex: i % 3 }));
      if (sentences.length === 0 && para.trim()) {
        sentences.push({ text: para.trim(), animIndex: 0 });
      }
      return { sentences };
    })
    .filter((p) => p.sentences.length > 0);
}

const SentenceWrapper: React.FC<{
  animIndex: number;
  children: React.ReactNode;
  isComplete: boolean;
}> = ({ animIndex, children, isComplete }) => {
  const idx = animIndex % 3;

  if (idx === 2) {
    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={isComplete ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="inline"
        style={
          isComplete
            ? {
                background: 'linear-gradient(90deg, #c8a45c 0%, #e8d5a3 50%, #c8a45c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }
            : undefined
        }
      >
        {children}
      </motion.span>
    );
  }

  if (idx === 1) {
    return (
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={isComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="inline"
      >
        {children}
      </motion.span>
    );
  }

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={isComplete ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="inline"
    >
      {children}
    </motion.span>
  );
};

const GoldenCursor: React.FC = () => (
  <span className="inline-block w-[2px] h-[1em] bg-[#c8a45c] ml-0.5 align-middle animate-caret-blink" />
);

const TaijiSpinner: React.FC = () => (
  <motion.span
    initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
    animate={{ opacity: 1, scale: 1, rotate: 360 }}
    transition={{ duration: 0.5, ease: 'easeInOut' }}
    className="inline-block text-[#c8a45c] mx-2 text-lg"
  >
    ☯
  </motion.span>
);

const BreathingTypewriter: React.FC<BreathingTypewriterProps> = ({
  text,
  baseSpeed = 30,
  highlightSpeed = 100,
  sentencePause = 300,
  paragraphPause = 500,
  onComplete,
  className = '',
}) => {
  const paragraphs = useMemo(() => splitIntoParagraphs(text), [text]);

  const [paraIndex, setParaIndex] = useState(0);
  const [sentIndex, setSentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isParagraphTransition, setIsParagraphTransition] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [completedSentences, setCompletedSentences] = useState<Set<string>>(new Set());

  const abortRef = useRef(false);

  const currentPara = paragraphs[paraIndex];
  const currentSent = currentPara?.sentences[sentIndex];
  const currentChar = currentSent?.text[charIndex] ?? '';
  const isHighlightChar = HIGHLIGHT_CHARS.has(currentChar);
  const speed = isHighlightChar ? highlightSpeed : baseSpeed;

  const advance = useCallback(() => {
    if (abortRef.current) return;

    if (!currentPara || !currentSent) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    if (charIndex < currentSent.text.length - 1) {
      setCharIndex((prev) => prev + 1);
      return;
    }

    setCompletedSentences((prev) => {
      const next = new Set(prev);
      next.add(`${paraIndex}-${sentIndex}`);
      return next;
    });

    if (sentIndex < currentPara.sentences.length - 1) {
      setIsPaused(true);
      setTimeout(() => {
        if (abortRef.current) return;
        setSentIndex((prev) => prev + 1);
        setCharIndex(0);
        setIsPaused(false);
      }, sentencePause);
    } else if (paraIndex < paragraphs.length - 1) {
      setIsParagraphTransition(true);
      setTimeout(() => {
        if (abortRef.current) return;
        setParaIndex((prev) => prev + 1);
        setSentIndex(0);
        setCharIndex(0);
        setIsParagraphTransition(false);
      }, paragraphPause);
    } else {
      setIsComplete(true);
      onComplete?.();
    }
  }, [
    charIndex,
    currentPara,
    currentSent,
    paraIndex,
    paragraphs.length,
    sentIndex,
    sentencePause,
    paragraphPause,
    onComplete,
  ]);

  useEffect(() => {
    if (isComplete || isPaused || isParagraphTransition) return;
    const timer = setTimeout(advance, speed);
    return () => clearTimeout(timer);
  }, [advance, speed, isComplete, isPaused, isParagraphTransition]);

  useEffect(() => {
    setParaIndex(0);
    setSentIndex(0);
    setCharIndex(0);
    setIsPaused(false);
    setIsParagraphTransition(false);
    setIsComplete(false);
    setCompletedSentences(new Set());
    abortRef.current = false;
    return () => {
      abortRef.current = true;
    };
  }, [text]);

  return (
    <div className={`font-sans leading-relaxed whitespace-pre-wrap text-[15px] ${className}`}>
      {paragraphs.map((para, pIdx) => (
        <div key={pIdx} className="mb-4">
          {para.sentences.map((sent, sIdx) => {
            const key = `${pIdx}-${sIdx}`;
            const isDone =
              completedSentences.has(key) ||
              pIdx < paraIndex ||
              (pIdx === paraIndex && sIdx < sentIndex);
            const isCurrent = pIdx === paraIndex && sIdx === sentIndex;
            const visibleText = isDone
              ? sent.text
              : isCurrent
                ? sent.text.slice(0, charIndex + 1)
                : '';

            if (!visibleText && !isDone && !isCurrent) return null;

            return (
              <span key={key} className="inline">
                <SentenceWrapper animIndex={sent.animIndex} isComplete={isDone}>
                  <span className="text-text-primary">{visibleText}</span>
                </SentenceWrapper>
                {isCurrent && !isPaused && !isParagraphTransition && !isComplete && <GoldenCursor />}
                {isCurrent && isPaused && <GoldenCursor />}
              </span>
            );
          })}
          <AnimatePresence>
            {isParagraphTransition && pIdx === paraIndex && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center my-2"
              >
                <TaijiSpinner />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default BreathingTypewriter;
