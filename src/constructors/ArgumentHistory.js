"use strict";

export function ArgumentHistory(
  argumentHistoryArray = [],
  index = 0
) {
  this.argumentHistoryArray = argumentHistoryArray;
  this.index = index;
  this.length = 0;

  this.push = (item) =>  {
    this.argumentHistoryArray.push(item);
    this.length = this.argumentHistoryArray.length;
  }
}