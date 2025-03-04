// Assign string values to all the enums so that there's no risk
// of numbers being reassigned when new keys are added.
enum LOCAL_STORAGE_KEYS {
  COLOR_SCHEME = "COLOR_SCHEME",
}

function setLocalStorage(key: LOCAL_STORAGE_KEYS, value: string) {
  localStorage.setItem(key, value);
}

function getLocalStorage(key: LOCAL_STORAGE_KEYS) {
  return localStorage.getItem(key);
}

export {
  setLocalStorage as set,
  getLocalStorage as get,
  LOCAL_STORAGE_KEYS as KEYS,
};
