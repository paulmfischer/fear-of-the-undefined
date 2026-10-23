const segmenter = new Intl.Segmenter("en", { granularity: "word" });

// Estimate reading time from raw Markdown at 275 words per minute.
export function readingMinutes(content: string): number {
  let words = 0;
  for (const word of segmenter.segment(content)) if (word.isWordLike) words++;
  return Math.ceil(Number((words / 275).toFixed(2)));
}
