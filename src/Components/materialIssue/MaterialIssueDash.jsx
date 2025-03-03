import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MaterialIssueDash = () => {
  const [materialIssues, setMaterialIssues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("MaterialIssue");
    if (data) {
      setMaterialIssues(JSON.parse(data));
    }
  }, []);

  const handleEdit = (id) => {
    sessionStorage.setItem("issueToEdit", id);
    navigate("/");
  };

  const handleCreateNew = () => {
    sessionStorage.removeItem("issueToEdit");
    navigate("/");
  };

  return (
    <div>
      <h1>Material Issue Dashboard</h1>
      <button onClick={handleCreateNew}>New Material Issue</button>
      <table>
        <thead>
          <tr>
            <th>Doc No</th>
            <th>Doc Date</th>
            <th>Issued To</th>
            <th>Doc Status</th>
            <th>Issued Material Count</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {materialIssues.map((issue, index) => (
            <tr key={index}>
              <td>{issue.docNo}</td>
              <td>{issue.docDate}</td>
              <td>{issue.issuedTo}</td>
              <td>{issue.docStatus}</td>
              <td>{issue.issuedMaterial.length}</td>
              <td>
                <button onClick={() => handleEdit(issue.docNo)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialIssueDash;
