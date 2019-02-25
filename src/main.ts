import * as fs from 'fs';
import {
  ParseNode,
  parse
} from './parser';

function console_eval(nodes: ParseNode[]) {
  let text = "";
  const context = {};
  for (const node of nodes) {
    switch (node.kind) {
      case 'Text': {
        text += node.text;
        break;
      }
      case 'JS': {
        const code = new Function('context',
          `'use strict'; return (() => {${node.text}})();`
        );
        text += String(code(context));
        break;
      }
    }
  }
  process.stdout.write(text);
}

console_eval(parse([fs.readFileSync(process.argv[2], 'utf8'), 0]))
