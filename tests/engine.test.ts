import { describe, it, expect } from 'vitest';
import { calculateArrowSpine, getIdealArrowLength, calculateDrawLength } from '../src/lib/archerUtils';

describe('Archery Tactical Engine (archerUtils)', () => {
  describe('calculateArrowSpine', () => {
    it('should calculate stiffer spine for higher draw weight', () => {
      const spine30 = calculateArrowSpine(28, 30, 'recurve');
      const spine50 = calculateArrowSpine(28, 50, 'recurve');
      // Lower numeric value = stiffer spine
      expect(spine50).toBeLessThan(spine30);
    });

    it('should calculate stiffer spine for longer arrows', () => {
      const short = calculateArrowSpine(26, 40, 'recurve');
      const long = calculateArrowSpine(30, 40, 'recurve');
      expect(long).toBeLessThan(short);
    });

    it('should account for compound bow energy multiplier', () => {
      const recurve = calculateArrowSpine(28, 40, 'recurve');
      const compound = calculateArrowSpine(28, 40, 'compound');
      // Compound bows need much stiffer arrows
      expect(compound).toBeLessThan(recurve);
    });
  });

  describe('getIdealArrowLength', () => {
    it('should recommend 1-2 inches over draw length', () => {
      const draw = 28;
      const ideal = getIdealArrowLength(draw);
      expect(ideal).toBeGreaterThan(draw);
      expect(ideal).toBeLessThanOrEqual(draw + 2);
    });
  });

  describe('calculateDrawLength', () => {
    it('should return correct draw length for standard wingspan', () => {
      // 70" wingspan / 2.5 = 28"
      expect(calculateDrawLength(70)).toBe(28);
    });
  });
});
