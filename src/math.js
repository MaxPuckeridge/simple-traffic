/**
 * Modulo method. Supports negative numbers.
 * @see http://stackoverflow.com/questions/4467539/javascript-modulo-not-behaving
 * @param a
 * @param b
 * @return {number}
 */
function mod(a, b) {
  return ((a % b) + b) % b;
}

module.exports = {
  'mod': mod
};