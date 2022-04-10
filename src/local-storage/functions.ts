export function saveLocalStorage<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadLocalStorage<T>(key: string): T | null {
  const value = window.localStorage.getItem(key);
  return value === null ? null : JSON.parse(value);
}
