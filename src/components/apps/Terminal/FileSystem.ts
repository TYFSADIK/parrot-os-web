// Re-export everything from the lib/filesystem module
export type { FSNode } from '@/lib/filesystem';
export {
  defaultFilesystem,
  getNodeAtPath,
  getParentPath,
  resolvePath,
  normalizePath,
  formatSize,
  getFileSize,
  setNodeAtPath,
  deleteNodeAtPath,
  deepClone,
  listDirectory,
  getPermissionString,
} from '@/lib/filesystem';
