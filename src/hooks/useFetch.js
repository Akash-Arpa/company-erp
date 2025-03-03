export async function useFetch(url) {
  const response = await fetch(url);
  // console.log(response);
  const data = await response.json();
  // console.log(data);

  return data.result;
}
