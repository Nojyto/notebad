export const getFileName = (filePath: string) => filePath.split(/[/\\]/).pop() || 'Untitled';

export const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes < 1024) return `${sizeInBytes} B`;
  const kb = sizeInBytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
};
