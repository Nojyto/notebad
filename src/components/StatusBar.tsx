import { useEffect, useState } from "react";
import { formatFileSize } from "../utils/utils";

interface StatusBarProps {
  content: string;
  selectionStart: number;
}

const StatusBar = ({ content, selectionStart }: StatusBarProps) => {
  const [fileSize, setFileSize] = useState(0);
  const [totalLines, setTotalLines] = useState(1);
  const [currentLine, setCurrentLine] = useState(1);

  useEffect(() => {
    setFileSize(new TextEncoder().encode(content).length);
    setTotalLines(content.split("\n").length);
    const lineIndex = content.slice(0, selectionStart).split("\n").length;
    setCurrentLine(lineIndex);
  }, [content, selectionStart]);

  return (
    <div className="absolute bottom-3 right-3 text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-md shadow-md pointer-events-none select-none opacity-95">
      <span>{formatFileSize(fileSize)}</span>
      <span className="mx-2">|</span>
      <span>{`Ln ${currentLine}/${totalLines}`}</span>
    </div>
  );
};

export default StatusBar;
