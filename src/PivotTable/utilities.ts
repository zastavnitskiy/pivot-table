export function classnames(...args: any[]): string {
  return args.filter(arg => Boolean(arg)).join(" ");
}

export function formatNumber(number: number): string {
  return Intl.NumberFormat("en-US").format(number);
}
