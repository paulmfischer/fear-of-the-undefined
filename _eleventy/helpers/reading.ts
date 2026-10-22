const segmenter = new Intl.Segmenter("en", { granularity: "word" });

// Match Lume's raw-Markdown word segmentation and 275 words/minute estimate.
export function readingMinutes(content: string): number {
  let words = 0;
  for (const word of segmenter.segment(content)) if (word.isWordLike) words++;
  return Math.ceil(Number((words / 275).toFixed(2)));
}
