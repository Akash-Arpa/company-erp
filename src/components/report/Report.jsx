import React, { useEffect, useState } from "react";
import useDateFilter from "../../hooks/useDateFilter";
import "./Report.css";

export default function Report() {
  let stockDetails = JSON.parse(localStorage.getItem("stockDetails"));
  let stockSummary = JSON.parse(localStorage.getItem("stockSummary"));

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isValidDate, setIsValidDate] = useState(false);
  const { filterByDate } = useDateFilter();

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name == "from_date") {
      setFromDate(value);
      if (toDate) {
        setIsValidDate(true);
      }
    } else {
      setToDate(value);
      if (fromDate) {
        setIsValidDate(true);
      }
    }
  };

  return (
    <div>
      <div className="dates">
        <label htmlFor="from_date">From Date </label>
        <input
          type="date"
          id="from_date"
          name="from_date"
          onChange={(e) => handleChange(e)}
        />
        <label htmlFor="to_date">To Date </label>
        <input
          type="date"
          id="to_date"
          name="to_date"
          onChange={(e) => handleChange(e)}
        />
      </div>

      <br />
      <table>
        <thead>
          <tr>
            <th className="border">Stock No.</th>
            <th className="border">Item</th>
            <th className="border">Recieved</th>
            <th className="border">Issued</th>
            <th className="border">Balance Qty.</th>
          </tr>
        </thead>
        <tbody>
          {stockSummary &&
            stockSummary
              .filter(
                (stockS) =>
                  filterByDate(stockS.docDate, fromDate, toDate) && isValidDate
              )
              .map((stockS, index) => {
                return (
                  <>
                    <tr key={stockS.stock_id}>
                      <td className="border">{stockS.stock_id}</td>
                      <td className="border">{stockS.item_id}</td>
                      <td className="border">{stockS.recieved}</td>
                      <td className="border">{stockS.issued}</td>
                      <td className="border">{stockS.balance}</td>
                    </tr>
                    {/* <tr> */}
                    <details>
                      <summary></summary>
                      <table className="padd-4">
                        <thead>
                          <tr>
                            <th className="border">Form Code</th>
                            <th className="border">Document No Yearly</th>
                            <th className="border">Date</th>
                            <th className="border">Received</th>
                            <th className="border">Issued</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stockDetails &&
                            stockDetails
                              .filter(
                                (stockD) =>
                                  stockD.stock_id == stockS.stock_id &&
                                  filterByDate(stockD.docDate) &&
                                  isValidDate
                              )
                              .map((stockD, idx) => {
                                return (
                                  <tr key={stockD.stockDetail_id}>
                                    <td className="border">
                                      {stockD.formCode}
                                    </td>
                                    <td className="border">
                                      {stockD.docNoYearly}
                                    </td>
                                    <td className="border">{stockD.docDate}</td>
                                    <td className="border">
                                      {stockD.recieved}
                                    </td>
                                    <td className="border">{stockD.issued}</td>
                                  </tr>
                                );
                              })}
                        </tbody>
                      </table>
                    </details>
                    {/* </tr> */}
                  </>
                );
              })}
        </tbody>
      </table>
    </div>
  );
}
