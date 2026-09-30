"use strict";

export function Directory(
  name,
  parent = null,
  type = "directory",
  size = 0,
  children = new Map(),
  createdAt = Date.now(),
  lastModified = Date.now()
) {
  this.name = name;
  this.parent = parent;
  this.type = type;
  this.size = size;
  this.children = children;
  this.createdAt = createdAt;
  this.lastModified = lastModified;
}