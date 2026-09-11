let pendingFile: File | null = null;
export function setPendingAskFile(file: File) { pendingFile = file; }
export function getPendingAskFile() { return pendingFile; }
export function clearPendingAskFile() { pendingFile = null; }
