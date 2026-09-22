"use strict";

export const DIRECTORY_CREATED_SUCCESSFULLY = 200;
export const DIRECTORY_INVALID_NAME = 201;
export const DIRECTORY_ALREADY_EXISTS = 203;
export const DIRECTORY_NOT_FOUND = 204;

export const FILE_CREATED_SUCCESSFULLY = 300;
export const FILE_INVALID_NAME = 301;
export const FILE_ALREADY_EXISTS = 303;
export const FILE_NOT_FOUND = 304;

export function DirectorySystemError(message, code) {
  Error.call(this, message);

  this.message = message;
  this.code = code;
}

DirectorySystemError.prototype = Object.create(Error.prototype);
DirectorySystemError.prototype.constructor = DirectorySystemError;

export function FileSystemError(message, code) {
  this.message = message;
  this.code = code;
}

FileSystemError.prototype = Object.create(Error.prototype);
FileSystemError.prototype.constructor = FileSystemError;