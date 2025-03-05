import { useEffect, useState } from "react";

const useFetch = async (url) => {
  const response = await fetch(url);

  const data = await response.json();
  // console.log(data, "Data");
  return data.result ? data.result : data;
};

export default useFetch;

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
