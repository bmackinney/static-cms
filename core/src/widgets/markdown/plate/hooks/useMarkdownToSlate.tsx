import { useEffect, useState } from 'react';
import markdown from 'remark-parse';
import slate from 'remark-slate';
import { unified } from 'unified';

import type { MdValue } from '../plateTypes';

const useMarkdownToSlate = (markdownValue: string): [MdValue, boolean] => {
  const [loaded, setLoaded] = useState(false);
  const [slateValue, setSlateValue] = useState<MdValue>([]);

  useEffect(() => {
    unified()
      .use(markdown)
      .use(slate)
      .process(markdownValue, (err, file) => {
        if (err) {
          console.log(err);
          return;
        }
        setSlateValue(file?.result as MdValue);
        setLoaded(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [slateValue, loaded];
};

export default useMarkdownToSlate;
