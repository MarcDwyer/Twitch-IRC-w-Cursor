import { useState } from "react";

interface BlurredTextProps {
  text: string;
  className?: string;
}

function BlurredText({ text, className = "" }: BlurredTextProps) {
  const [isBlurred, setIsBlurred] = useState(true);

  return (
    <span
      onClick={() => setIsBlurred(!isBlurred)}
      className={`${isBlurred ? "blur-sm select-none" : "blur-none select-auto"} transition-all duration-200 cursor-pointer ${className}`}
    >
      {text}
    </span>
  );
}

export default BlurredText;
