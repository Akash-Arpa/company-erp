import React, { useEffect, useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const SearchPo = () => {
  const [poMaster, setPoMaster] = useState([]);
  const fetchAll = async () => {
    
    const PoList = await useFetch(
      `https://67c168b561d8935867e2e089.mockapi.io/api/poMaster/purchaseOrder`
    );
    console.log(PoList);
    setPoMaster((prev) => PoList);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const navigate = useNavigate();
  const handleClick = (e, id) => {
    localStorage.setItem("editPoId", id);
    navigate("/");
  };
  return (
    <div>
      SearchPo
      <table>
        <thead>
          <tr>
            <td>Sn.</td>
            <td>PoNo</td>
            <td>Edit</td>
          </tr>
        </thead>
        <tbody>
          {poMaster.map((el, idx) => {
            return (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{el.poNo}</td>
                <td>
                  <button
                    onClick={(e) => handleClick(e, el.id)}
                    type="button"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SearchPo;
