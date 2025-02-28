import React from "react";

const GeneralDetail = ({ totalBasic, totalTax }) => {
  return (
    <div className="general-detail-wrapper">
      <table border={1} className="general-grid">
        <tbody>
          <tr>
            <td>
              <strong>Total Basic</strong>
            </td>
            <td className="text-right">{totalBasic}</td>
          </tr>
          <tr>
            <td>
              <strong>Total Tax</strong>
            </td>
            <td className="text-right">{totalTax}</td>
          </tr>
          <tr>
            <td>
              <strong>Total Net Amount</strong>
            </td>
            <td className="text-right">
              {(Number(totalBasic) + Number(totalTax)).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default GeneralDetail;
