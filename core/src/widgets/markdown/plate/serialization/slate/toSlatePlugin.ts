import transform from './deserialize';

import type { Plugin } from 'unified';
import type { MdastNode, OptionType } from './ast-types';

const plugin: Plugin = function (opts?: OptionType) {
  const compiler = (node: { children: Array<MdastNode> }) => {
    return node.children.map(c => transform(c, opts));
  };

  this.Compiler = compiler;
};

export default plugin;
