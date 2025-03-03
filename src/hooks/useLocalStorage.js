export function useLocalStorage(value) {
  const state = JSON.parse(window.localStorage.getItem(value)) || [];

  function setData(data) {
    window.localStorage.setItem(value, JSON.stringify(data));
  }

  return [state, setData];
}