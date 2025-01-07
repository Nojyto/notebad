export const getFileName = (filePath: string) => filePath.split(/[/\\]/).pop() || 'Untitled';
