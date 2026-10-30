export type PhosphorWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';

/**
 * Closest Phosphor weight for a Lucide-style stroke width (the unit of the
 * theme's `--cc-icon-stroke`): up to 1.25 thin, 1.5 light, 2 regular, above bold.
 */
export function weightForStroke(stroke: number): PhosphorWeight {
  if (stroke <= 1.25) return 'thin';
  if (stroke <= 1.5) return 'light';
  if (stroke <= 2) return 'regular';
  return 'bold';
}
