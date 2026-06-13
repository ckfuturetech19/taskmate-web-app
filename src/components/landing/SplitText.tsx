import React from 'react';

interface SplitTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  charClassName?: string;
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  wordClassName = 'inline-block',
  charClassName = 'inline-block',
}) => {
  return (
    <span className={`inline-block ${className}`}>
      {text.split(' ').map((word, wordIndex) => (
        <span
          key={wordIndex}
          className={`${wordClassName} mr-[0.25em]`}
          style={{ whiteSpace: 'nowrap' }}
        >
          {word.split('').map((char, charIndex) => (
            <span
              key={charIndex}
              className={charClassName}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
};

export default SplitText;
