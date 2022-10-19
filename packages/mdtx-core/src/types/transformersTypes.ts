import matter from 'gray-matter';

export type generatedMdLibType = Record<
  string,
  Pick<ReturnType<typeof matter>, 'content' | 'data' | 'excerpt'>
>;
