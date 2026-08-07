/**
 * Strip standard prompt variable braces: {{name}} → name
 * Leaves unmatched braces alone.
 */
export function stripVariableBraces(text: string): string {
  return text.replace(/\{\{([^{}]*?)\}\}/g, '$1');
}
