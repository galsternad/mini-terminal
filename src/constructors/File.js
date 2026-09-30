"use strict";

export function File(
  name,
  parent,
  type = "file",
  content = "",
  size = 0,
  createdAt = Date.now(),
  lastModified = Date.now()
) {
  this.name = name;
  this.parent = parent;
  this.type = type;
  this.content = content;
  this.size = size;
  this.createdAt = createdAt;
  this.lastModified = lastModified;
}
