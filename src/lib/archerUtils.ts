/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Calculates draw length in inches based on wingspan in centimeters.
 * 
 * @param {number} wingspanCm - The wingspan of the archer in centimeters.
 * @returns {number} The calculated draw length in inches (1-decimal place precision).
 */
export const calculateDrawLength = (wingspanCm: number) => {
  return parseFloat(((wingspanCm / 2.54) / 2.5).toFixed(1));
};

/**
 * Calculates the ideal arrow shaft length in inches based on draw length.
 * Standard safety guidelines dictate the shaft should be 1.5 inches past the bow shelf.
 * 
 * @param {number} drawLength - The archer's calculated draw length in inches.
 * @returns {number} The ideal arrow shaft length in inches (1-decimal place precision).
 */
export const getIdealArrowLength = (drawLength: number) => {
  return parseFloat((drawLength + 1.5).toFixed(1));
};

/**
 * Calculates the recommended static arrow spine (stiffness rating) based on multiple dynamic factors.
 * Standardizes calculation to a standard 28" shaft with a 100-grain point, adjusted by length difference
 * and point weight variation.
 * 
 * @param {number} arrowLength - Arrow shaft length in inches.
 * @param {number} drawWeight - Bow draw weight in pounds (lbs).
 * @param {string} [bowType='recurve'] - The category of bow ('traditional', 'recurve', 'compound').
 * @param {number} [pointWeight=100] - Arrow point weight in grains.
 * @returns {number} Recommended spine deflection rating (e.g. 340, 400, 500), clamped between 200 and 1800.
 */
export const calculateArrowSpine = (arrowLength: number, drawWeight: number, bowType: string = 'recurve', pointWeight: number = 100) => {
  // Base Spine Chart (Standardized for 28" shaft, 100gr point)
  // Bow type multiplier (Compound bows are much more aggressive/energetic)
  const energeticMultiplier = bowType === 'compound' ? 1.6 : (bowType === 'traditional' ? 0.9 : 1.0);
  const virtualWeight = drawWeight * energeticMultiplier;

  let baseSpine: number;
  if (virtualWeight >= 75) baseSpine = 250;
  else if (virtualWeight >= 70) baseSpine = 300;
  else if (virtualWeight >= 65) baseSpine = 340;
  else if (virtualWeight >= 60) baseSpine = 370;
  else if (virtualWeight >= 55) baseSpine = 400;
  else if (virtualWeight >= 50) baseSpine = 450;
  else if (virtualWeight >= 45) baseSpine = 500;
  else if (virtualWeight >= 40) baseSpine = 550;
  else if (virtualWeight >= 36) baseSpine = 600;
  else if (virtualWeight >= 32) baseSpine = 650;
  else if (virtualWeight >= 28) baseSpine = 750;
  else if (virtualWeight >= 24) baseSpine = 850;
  else if (virtualWeight >= 20) baseSpine = 1000;
  else if (virtualWeight >= 15) baseSpine = 1200;
  else baseSpine = 1400;

  // Length Adjustment: 1" = ~55 spine units
  const lengthDiff = arrowLength - 28;
  let adjustedSpine = baseSpine - (lengthDiff * 55);

  // Point Weight Adjustment: Every grain above 100 weakens dynamic spine
  const weightDiff = pointWeight - 100;
  adjustedSpine = adjustedSpine - (weightDiff * 0.7);

  const finalSpine = Math.round(adjustedSpine / 10) * 10;

  return Math.max(200, Math.min(1800, finalSpine));
};

/**
 * Convenience helper combining getIdealArrowLength and calculateArrowSpine in a single structure.
 * 
 * @param {number} drawLength - Draw length in inches.
 * @param {number} drawWeight - Bow draw weight in pounds (lbs).
 * @param {string} [bowType='recurve'] - The category of bow ('traditional', 'recurve', 'compound').
 * @param {number} [pointWeight=100] - Arrow point weight in grains.
 * @returns {{arrowLength: number, arrowSpine: number}} Object containing ideal arrows shaft length and recommended stiffness rating.
 */
export const calculateArrowSpecs = (drawLength: number, drawWeight: number, bowType: string = 'recurve', pointWeight: number = 100) => {
  const arrowLength = getIdealArrowLength(drawLength);
  const arrowSpine = calculateArrowSpine(arrowLength, drawWeight, bowType, pointWeight);
  return { arrowLength, arrowSpine };
};

/**
 * Recommends optimal brace height in inches based on riser length and limb size.
 * Modern ATA standard recurve ratios applied.
 * 
 * @param {number} riser - Bow riser length in inches.
 * @param {'short' | 'medium' | 'long'} limbs - Limb sizes.
 * @returns {number} Ideal brace height range midpoint in inches.
 */
export const calculateBraceHeight = (riser: number, limbs: 'short' | 'medium' | 'long') => {
  // Total Bow Length mapping
  let bowLength = riser + (limbs === 'short' ? 41 : limbs === 'long' ? 45 : 43);
  
  // Average Recommended Brace Heights (ATA Estimates for modern recurve)
  if (bowLength <= 66) return 8.3; // Approx 21-23 cm
  if (bowLength <= 68) return 8.6;
  if (bowLength <= 70) return 8.9;
  return 9.1;
};
