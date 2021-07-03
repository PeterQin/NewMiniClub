/**
 * 拓展对象
 */
export function extend(target, ...args) {
  const sources = args;

  for (let i = 0; i < sources.length; i += 1) {
    const source = sources[i];
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
}
