const DEFAULT_DATA_POINTS = 64

/** Generate random data for given `n` datapoint. */
export function generateRandomSeries({n=DEFAULT_DATA_POINTS, min=0, max=1} = {}) {
  const bound = max - min
  let result = []
  for (let i = 0; i < n; i++) {
    result.push(Math.random() * bound + min)
  }
  return result
}
/** Generate sequence series start from `i` */
export function generateSequence({n=DEFAULT_DATA_POINTS, begin=0} = {}) {
  let result = []
  for (let i = 0; i < n; i++) {
    result.push(begin + i)
  }
  return result
}