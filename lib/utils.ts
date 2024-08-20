export const formatBytes = (bytes: number, precision: IntRange<0, 21> = 2) => {
  if (bytes < 1024) return `${bytes.toFixed(precision)} b`
  const suffixes = "kmg"

  const exp = Math.floor(logBase(bytes, 1024))
  const value = bytes / 1024 ** exp

  return `${value.toFixed(precision)} ${suffixes[exp - 1]}b`
}

export const logBase = (value: number, base: number) => Math.log(value) / Math.log(base)
