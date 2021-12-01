export function formatDate(): string {
  const date: Date = new Date();
  const year: number = date.getFullYear();
  const month: string =
    (date.getMonth() + 1 > 9 && date.getMonth() + 1 + "") ||
    "0" + (date.getMonth() + 1);
  const day: string =
    (date.getDate() > 9 && date.getDate() + "") || "0" + date.getDate();
  return `${year}${month}${day}`;
}
