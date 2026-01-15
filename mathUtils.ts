
/**
 * Computes PI to n decimal places using the Machin formula:
 * pi/4 = 4*arctan(1/5) - arctan(1/239)
 * 
 * We use BigInt to maintain precision.
 */
export function calculatePiDeterministic(digits: number): string {
  const precision = BigInt(digits + 10);
  const multiplier = 10n ** precision;

  function arctan(xInv: bigint, mult: bigint): bigint {
    let result = mult / xInv;
    let xInvSquared = xInv * xInv;
    let term = result;
    let n = 3n;
    let sign = -1n;

    while (term !== 0n) {
      term = term / xInvSquared;
      let step = term / n;
      if (sign === 1n) result += step;
      else result -= step;
      n += 2n;
      sign = -sign;
    }
    return result;
  }

  // pi = 16*arctan(1/5) - 4*arctan(1/239)
  let pi = 16n * arctan(5n, multiplier) - 4n * arctan(239n, multiplier);
  
  const piStr = pi.toString();
  // Format as 3.14159...
  return "3." + piStr.substring(1, digits + 1);
}

export const PI_100_GROUND_TRUTH = calculatePiDeterministic(100);
