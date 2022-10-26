import fs from 'fs';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import path from 'path';

import { SUMMARY_MIN_PARAGRAPH_LENGTH } from '../constants';
import menu from './menu';

import type { FileMatter, DocsPage, DocsData, DocsGroup, DocsGroupLink } from '../interface';

const docsDirectory = path.join(process.cwd(), 'content/docs');

let docsMatterCache: FileMatter[];
let docsCache: [DocsPage[], DocsGroup[]];

export function fetchDocsMatter(): FileMatter[] {
  if (docsMatterCache && process.env.NODE_ENV !== 'development') {
    return docsMatterCache;
  }
  // Get file names under /docs
  const fileNames = fs.readdirSync(docsDirectory);
  const allDocsMatter = fileNames
    .filter(it => it.endsWith('.mdx'))
    .map(fileName => {
      // Read file as string
      const fullPath = path.join(docsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the doc metadata section
      const matterResult = matter(fileContents, {
        engines: {
          yaml: s => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object,
        },
      });
      return { fileName, fullPath, matterResult };
    });

  // Sort docs by date
  docsMatterCache = allDocsMatter.sort(
    (a, b) => a.matterResult.data.weight - b.matterResult.data.weight,
  );

  return docsMatterCache;
}

export function fetchDocsContent(): [DocsPage[], DocsGroup[]] {
  if (docsCache && process.env.NODE_ENV !== 'development') {
    return docsCache;
  }

  const allDocsData: DocsPage[] = fetchDocsMatter().map(
    ({ fileName, fullPath, matterResult: { data, content } }) => {
      const slug = fileName.replace(/\.mdx$/, '');

      const summaryRegex = /^<p>([\w\W]+?)<\/p>/i;
      let summaryMatch = summaryRegex.exec(content);

      const htmlSummaryRegex =
        /^([\s\n]*(?:<(?:p|ul|ol|h1|h2|h3|h4|h5|h6|div)>(?:[\s\S])*?<\/(?:p|ul|ol|h1|h2|h3|h4|h5|h6|div)>[\s\n]*){1,2})/i;
      if (
        !summaryMatch ||
        summaryMatch.length < 2 ||
        summaryMatch[1].length < SUMMARY_MIN_PARAGRAPH_LENGTH
      ) {
        summaryMatch = htmlSummaryRegex.exec(content);
      }

      return {
        fullPath,
        data: {
          ...data,
          slug,
        } as DocsData,
        summary: summaryMatch && summaryMatch.length >= 2 ? summaryMatch[1] : content,
        content,
      };
    },
  );

  const pagesByGroup: Record<string, DocsGroupLink[]> = allDocsData.reduce((acc, doc) => {
    if (!(doc.data.group in acc)) {
      acc[doc.data.group] = [];
    }
    acc[doc.data.group].push({
      title: doc.data.title,
      slug: doc.data.slug,
    });
    return acc;
  }, {} as Record<string, DocsGroupLink[]>);

  const docsGroups: DocsGroup[] = menu.docs.map(group => ({
    ...group,
    links: pagesByGroup[group.name] ?? [],
  }));

  docsCache = [allDocsData, docsGroups];

  return docsCache;
}