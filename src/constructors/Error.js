"use strict";

export const PROCESS_EXECUTED_SUCCESSFULLY = 100;
export const PROCESS_ERROR = 101;

export const DIRECTORY_CREATED_SUCCESSFULLY = 200;
export const DIRECTORY_REMOVED_SUCCESSFULLY = 201;
export const DIRECTORY_INVALID_NAME = 203;
export const DIRECTORY_NOT_FOUND = 204;
export const DIRECTORY_ALREADY_EXISTS = 205;
export const DIRECTORY_NOT_EMPTY = 206;

export const FILE_CREATED_SUCCESSFULLY = 300;
export const FILE_REMOVED_SUCCESSFULLY = 301;
export const FILE_MODIFIED_SUCCESSFULLY = 302;
export const FILE_INVALID_NAME = 303;
export const FILE_NOT_FOUND = 304;
export const FILE_ALREADY_EXISTS = 305;

export const FLAGS_PARSED_SUCCESSFULLY = 700;
export const FLAG_NOT_FOUND = 704;

export function DirectorySystemError(message, code) {
  Error.call(this, message);

  this.message = message;
  this.code = code;
}

DirectorySystemError.prototype = Object.create(Error.prototype);
DirectorySystemError.prototype.constructor = DirectorySystemError;

export function FileSystemError(message, code) {
  Error.call(this, message);
  
  this.message = message;
  this.code = code;
}

FileSystemError.prototype = Object.create(Error.prototype);
FileSystemError.prototype.constructor = FileSystemError;

export function FlagError(message, code) {
  Error.call(this, message);

  this.message = message;
  this.code = code;
}

FlagError.prototype = Object.create(Error.prototype);
FlagError.prototype.constructor = FlagError;

export function TokenizerError(message, code) {
  Error.call(this, message);

  this.message = message;
  this.code = code;
}

TokenizerError.prototype = Object.create(Error.prototype);
TokenizerError.prototype.constructor = TokenizerError;