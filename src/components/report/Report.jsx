import React, { useEffect, useState } from "react";
import useDateFilter from "../hooks/useDateFilter.js";
import "./Report.css";

export default function Report() {

  localStorage.setItem(
    "stockDetails",
    JSON.stringify([
      {
        stockDetail_id: 1740738811968,
        stock_id: 1740738595695,
        docNo: "MI0001",
        docNoYearly: "MI0001Y",
        docDate: "2025-02-24",
        poNo: "PO0001",
        item_id: "MM0001",
        recieved: 0,
        issued: 5,
        formCode: "IMI",
      },
      {
        stockDetail_id: 1740738803961,
        stock_id: 1740738719032,
        docNo: "MI0001",
        docNoYearly: "MI0001Y",
        docDate: "2025-03-24",
        poNo: "PO0001",
        item_id: "MM0002",
        recieved: 0,
        issued: 10,
        formCode: "IMI",
      },
      {
        stockDetail_id: 1740738780673,
        stock_id: 1740738538880,
        docNo: "MI0001",
        docNoYearly: "MI0001Y",
        docDate: "2025-01-24",
        poNo: "PO0002",
        item_id: "MM0001",
        recieved: 0,
        issued: 2,
        formCode: "IMI",
      },
      {
        stockDetail_id: 1740738719032,
        stock_id: 1740738719032,
        docNo: "GRN0001",
        docNoYearly: "GRN0001Y",
        docDate: "2025-01-24",
        poNo: "PO0001",
        item_id: "MM0002",
        recieved: 30,
        issued: 0,
        formCode: "IGRN",
      },
      {
        stockDetail_id: 1740738595690,
        stock_id: 1740738595695,
        docNo: "GRN0001",
        docNoYearly: "GRN0001Y",
        docDate: "2025-02-24",
        poNo: "PO0001",
        item_id: "MM0001",
        recieved: 100,
        issued: 0,
        formCode: "IGRN",
      },
      {
        stockDetail_id: 1740738538880,
        stock_id: 1740738538880,
        docNo: "GRN0001",
        docNoYearly: "GRN0001Y",
        docDate: "2025-03-24",
        poNo: "PO0002",
        item_id: "MM0001",
        recieved: 20,
        issued: 0,
        formCode: "IGRN",
      },
    ])
  );

  let stockDetails = JSON.parse(localStorage.getItem("stockDetails"));

  localStorage.setItem(
    "stockSummary",
    JSON.stringify([
      {
        stock_id: 1740738719032,
        docNo: "GRN0001",
        docNoYearly: "GRN0001Y",
        docDate: "2025-02-24",
        poNo: "PO0001",
        item_id: "MM0002",
        recieved: 30,
        issued: 10,
        balance: 20,
        formCode: "IGRN",
      },
      {
        stock_id: 1740738595695,
        docNo: "GRN0001",
        docNoYearly: "GRN0001Y",
        docDate: "2025-03-24",
        poNo: "PO0001",
        item_id: "MM0001",
        recieved: 100,
        issued: 5,
        balance: 100,
        formCode: "IGRN",
      },
      {
        stock_id: 1740738538880,
        docNo: "GRN0001",
        docNoYearly: "GRN0001Y",
        docDate: "2025-01-24",
        poNo: "PO0002",
        item_id: "MM0001",
        recieved: 20,
        issued: 2,
        balance: 18,
        formCode: "IGRN",
      },
    ])
  );

  let stockSummary = JSON.parse(localStorage.getItem("stockSummary"));

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isValidDate, setIsValidDate] = useState(false);
  const {filterByDate} = useDateFilter();

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    
    if(name == 'from_date'){
        setFromDate(value);
        if(toDate){
            setIsValidDate(true);
        }
    }
    else {
        setToDate(value);
        if(fromDate){
            setIsValidDate(true);
        }
    }
  }

  return (
    <div>
      <div className="dates">
        <label htmlFor="from_date">From Date </label>
        <input type="date" id="from_date" name="from_date" onChange={(e)=> handleChange(e)} />
        <label htmlFor="to_date">To Date </label>
        <input type="date" id="to_date" name="to_date" onChange={(e)=> handleChange(e)} />
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
            stockSummary.filter(stockS => filterByDate(stockS.docDate, fromDate, toDate) && isValidDate).map((stockS, index) => {
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
                              .filter((stockD) => stockD.stock_id == stockS.stock_id && filterByDate(stockD.docDate)  && isValidDate)
                              .map((stockD, idx) => {
                                return (
                                  <tr key={stockD.stockDetail_id}>
                                    <td className="border">{stockD.formCode}</td>
                                    <td className="border">{stockD.docNoYearly}</td>
                                    <td className="border">{stockD.docDate}</td>
                                    <td className="border">{stockD.recieved}</td>
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