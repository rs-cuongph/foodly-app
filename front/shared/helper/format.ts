// Simple route parameter replacement without external dependencies

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

/**
 * Formats a route by replacing path parameters with values
 * @param route - The route pattern (e.g., '/groups/:id')
 * @param params - Object containing parameter values
 * @returns The formatted route with parameters replaced
 * @example
 * formatRoute('/groups/:id', { id: '123' }) // returns '/groups/123'
 */
export function formatRoute(
  route: string,
  params: Record<string, string | number>,
): string {
  let result = route;

  // Replace each parameter in the route
  Object.keys(params).forEach((key) => {
    result = result.replace(`:${key}`, String(params[key]));
  });

  return result;
}

export function calculateNo(
  index: number,
  currentPage: number | undefined,
  pageSize: number,
) {
  return index + 1 + ((currentPage ?? 1) - 1) * pageSize;
}
