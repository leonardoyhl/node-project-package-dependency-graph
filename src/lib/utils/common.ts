
export function transformMapToJson(map: Map<string, any>) {
  const json = {} as Record<string, any>;
  const keys = Array.from(map.keys());
  keys.forEach(key => {
    const value = map.get(key)!;
    let finalValue = value;
    if (value instanceof Set) {
      finalValue = Array.from(value);
    }
    json[key] = finalValue;
  });
  return json;
}
