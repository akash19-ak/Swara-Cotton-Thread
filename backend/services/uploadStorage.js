const fs = require('fs');
const path = require('path');

const DEFAULT_UPLOAD_DIR = path.resolve(__dirname, '../public/uploads');
const DEFAULT_UPLOAD_PUBLIC_BASE_URL = '/uploads';

function resolveUploadDir() {
  const configuredPath = process.env.UPLOAD_DIR || process.env.UPLOADS_DIR;
  if (!configuredPath) {
    return DEFAULT_UPLOAD_DIR;
  }

  return path.isAbsolute(configuredPath)
    ? configuredPath
    : path.resolve(process.cwd(), configuredPath);
}

function resolveUploadPublicBaseUrl() {
  const configuredBaseUrl = process.env.UPLOAD_PUBLIC_BASE_URL || process.env.UPLOAD_BASE_URL;
  if (!configuredBaseUrl) {
    return DEFAULT_UPLOAD_PUBLIC_BASE_URL;
  }

  return configuredBaseUrl.replace(/\/$/, '');
}

function ensureUploadDir(uploadDir = resolveUploadDir()) {
  fs.mkdirSync(uploadDir, { recursive: true });
  return uploadDir;
}

function getUploadDirectory() {
  return ensureUploadDir(resolveUploadDir());
}

function getUploadUrl(filename) {
  const publicBaseUrl = resolveUploadPublicBaseUrl();
  return `${publicBaseUrl}/${filename}`.replace(/([^:]\/)\/{2,}/g, '$1/');
}

function getUploadFilePath(filename, uploadDir = getUploadDirectory()) {
  return path.join(uploadDir, filename);
}

module.exports = {
  DEFAULT_UPLOAD_DIR,
  DEFAULT_UPLOAD_PUBLIC_BASE_URL,
  resolveUploadDir,
  resolveUploadPublicBaseUrl,
  ensureUploadDir,
  getUploadDirectory,
  getUploadUrl,
  getUploadFilePath
};
