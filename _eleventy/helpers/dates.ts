const displayDate = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function formatDate(value: Date | string): string {
  return displayDate.format(new Date(value));
}
