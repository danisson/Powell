namespace Nodes {
  export interface Text {
    kind: 'Text'
    text: string
  }

  export interface JS {
    kind: 'JS'
    text: string
  }

  // export interface FunctionCall {
  //   kind: 'FunctionCall'
  //   func: string
  //   args: number[]
  // }
}

export type ParseNode = Nodes.Text | Nodes.JS

function parseJS([string, start]: [string, number]) : [number, Nodes.JS] {
  let braces = 1;
  let i = start;
  while (braces > 0) {
    if (string[i] == '{') braces += 1;
    if (string[i] == '}') braces -= 1;
    i += 1;
  }

  return [i, {
    kind: 'JS',
    text: string.slice(start, i-1)
  }];
}

function parseText([string, start]: [string, number]) : [number, Nodes.Text] {
  let i = start;
  outer: while (i < string.length) {
    switch (string[i]) {
      case 'j': {
        if (string.slice(i, i+4) == 'js!{') break outer;
        break;
      }
    }
    i += 1;
  }

  return [i, {
    kind: 'Text',
    text: string.slice(start, i)
  }];
}

export function parse(fragment: [string, number]): ParseNode[] {
  let [string, start] = fragment;
  let i = start;

  const nodes : ParseNode[] = [];

  while (i < string.length) {
    let newNode: ParseNode;
    let newStart: number;

    switch (string[i]) {
      case 'j': {
        if (string.slice(i, i+4) == 'js!{') {
          [newStart, newNode] = parseJS([string, i+4]);
        } else {
          [newStart, newNode] = parseText([string, i]);
        }
        break;
      }
      default: {
        [newStart, newNode] = parseText([string, i]);
        break;
      }
    }

    i = newStart;
    nodes.push(newNode);
  }

  return nodes;
}
