import { describe, it, expect } from 'vitest';
import { 
  calculateArrowSpine, 
  getIdealArrowLength, 
  calculateDrawLength,
  calculateArrowSpecs,
  calculateBraceHeight 
} from '../src/lib/archerUtils';

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

    it('should account for traditional bow energy multipliers', () => {
      const traditional = calculateArrowSpine(28, 40, 'traditional');
      const recurve = calculateArrowSpine(28, 40, 'recurve');
      // Traditional bows are less energetic, thus needing weaker spine (higher numeric value)
      expect(traditional).toBeGreaterThan(recurve);
    });

    it('should weaken dynamic spine (reduce numeric value) with heavier point weights', () => {
      const lightPoint = calculateArrowSpine(28, 40, 'recurve', 80);
      const heavyPoint = calculateArrowSpine(28, 40, 'recurve', 150);
      // Heavier points weaken the arrow flight dynamic, calling for stiffer shaft (lower numeric rating)
      expect(heavyPoint).toBeLessThan(lightPoint);
    });

    it('should clamp spine values between safety floors and ceilings', () => {
      // Extremely high draw weight compound with long heavy arrows should not go below 200
      const extremeStiff = calculateArrowSpine(32, 80, 'compound', 250);
      expect(extremeStiff).toBe(200);

      // Extremely weak traditional setup with short light arrows should not exceed 1800
      const extremeWeak = calculateArrowSpine(20, 1, 'traditional', 0);
      expect(extremeWeak).toBe(1800);
    });

    it('should calculate base spine correctly for lightweight draw weights', () => {
      // Recurve, 28" length, 16 lb draw weight, 100gr point -> virtualWeight = 16 (meets baseSpine = 1200)
      const lightSpine = calculateArrowSpine(28, 16, 'recurve');
      expect(lightSpine).toBe(1200);
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
      // 70" wingspan = 177.8 cm. 177.8 / 2.54 / 2.5 = 28"
      expect(calculateDrawLength(177.8)).toBe(28);
    });
  });

  describe('calculateArrowSpecs', () => {
    it('should bundle safety specifications together perfectly', () => {
      const specs = calculateArrowSpecs(28, 40, 'recurve', 100);
      expect(specs).toHaveProperty('arrowLength');
      expect(specs).toHaveProperty('arrowSpine');
      expect(specs.arrowLength).toBe(29.5); // 28 + 1.5
      expect(specs.arrowSpine).toBeTypeOf('number');
    });
  });

  describe('calculateBraceHeight', () => {
    it('should adjust brace height recommendation for standard recurve dimensions', () => {
      // Riser 25" + short limbs (41) = 66" total -> 8.3" midpoint
      expect(calculateBraceHeight(25, 'short')).toBe(8.3);

      // Riser 25" + medium limbs (43) = 68" total -> 8.6" midpoint
      expect(calculateBraceHeight(25, 'medium')).toBe(8.6);

      // Riser 25" + long limbs (45) = 70" total -> 8.9" midpoint
      expect(calculateBraceHeight(25, 'long')).toBe(8.9);

      // Extra long setup: Riser 27" + long limbs (45) = 72" total -> 9.1" midpoint
      expect(calculateBraceHeight(27, 'long')).toBe(9.1);
    });
  });
});
