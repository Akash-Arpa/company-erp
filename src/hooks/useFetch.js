// export async function useFetch(url) {
//   const response = await fetch(url);
//   // console.log(response);
//   const data = await response.json();
//   // console.log(data);

//   return data.result;
// }
const useFetch = async (url) => {
  console.log(url);
  const response = await fetch(url);
  console.log(response);
  const data = await response.json();
  console.log(data.result);
  return data.result;
};

export default useFetch;

import { useEffect, useState } from "react";

export function useFetchData(url) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const res = await response.json();
        setData(res.result);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [url]);

  return data;
}
