import React from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

const SearchPo = () => {
  const [poMaster, setPoMaster] = useLocalStorage("poMaster");
  const navigate = useNavigate();
  const handleClick = (e, id) => {
    localStorage.setItem("editPoId", String(id));
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
                    onClick={(e) => handleClick(e, el.po_id)}
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
