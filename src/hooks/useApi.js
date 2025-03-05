// import { useState, useEffect } from "react";

// const useApi = (url, method = "GET", headers = {}) => {
//   const [data, setDataState] = useState(null);

//   useEffect(() => {
//     if (method === "GET") {
//       fetch(url, { headers })
//         .then((res) => res.json())
//         .then((data) => setDataState(data));
//     }
//   }, [url, method, headers]);

//   const setData = async (body) => {
//     console.log("body in api", body)
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         ...headers,
//       },
//       body: JSON.stringify(body),
//     });
//     const result = await response.json();
//     setDataState(result); // Update state with the response data
//   };

//   const updateData = async (body) => {
//     const response = await fetch(${url}/${1}, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         ...headers,
//       },
//       body: JSON.stringify(body),
//     });
//     const result = await response.json();
//     setDataState(result); // Update state with the updated data
//   };

//   return [data, updateData];
// };

// export default useApi;

import { useState, useEffect } from "react";

const useApi = (url, method = "GET", headers = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (method === "GET") {
      fetchData();
    }
  }, [url]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error(Failed to fetch: ${response.statusText});
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const request = async (method, body = null, id = null) => {
    setLoading(true);
    try {
      const response = await fetch(id ? ${url}/${id} : url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : null,
      });
      if (!response.ok) throw new Error(Failed to ${method}: ${response.statusText});
      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return [data, request, loading, error];
};

export default useApi;
