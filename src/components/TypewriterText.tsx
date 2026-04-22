import React, { useState, useEffect, useCallback } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  className?: string;
  showCursor?: boolean;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 30,
  delay = 0,
  onComplete,
  className = '',
  showCursor = true,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const startTyping = useCallback(() => {
    setHasStarted(true);
  }, []);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(startTyping, delay);
      return () => clearTimeout(timer);
    } else {
      startTyping();
    }
  }, [delay, startTyping]);

  useEffect(() => {
    if (!hasStarted) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [hasStarted, text, speed, onComplete]);

  return (
    <span className={`font-mono ${className}`}>
      {displayedText}
      {showCursor && !isComplete && (
        <span className="inline-block w-[2px] h-[1em] bg-text-primary ml-0.5 animate-caret-blink align-middle" />
      )}
    </span>
  );
};

export default TypewriterText;
