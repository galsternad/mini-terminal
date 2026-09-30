"use strict";

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