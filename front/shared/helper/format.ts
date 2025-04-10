/**
 * Formats a number with comma separators for thousands
 * @param value - The number to format
 * @returns The formatted string with comma separators
 * @example
 * commaFormat(1000) // returns "1,000"
 * commaFormat(1000000) // returns "1,000,000"
 */
export function commaFormat(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
