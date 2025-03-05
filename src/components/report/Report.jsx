import React, { useEffect, useState } from "react";
import useDateFilter from "../../hooks/useDateFilter";
import "./Report.css";
// import { stockApi} from "../../api/stockStore";
// import { useLoaderData} from 'react-router';

// export async function stockLoader() {
//   console.log("Stock Detail Loader....");
//   const stockDetails= await stockApi.fetchStockDetails();
//   const stockSummary= await stockApi.fetchStockSummary();

//   return {stockDetails, stockSummary};
// }

async function fetchStockDetails () {
  let response = await fetch('https://67c6b91b351c081993fe715a.mockapi.io/stockDetails');
  // console.log(response);
  let data = await response.json();
  return data;
};
async function fetchStockSummary(){
  let response = await fetch('https://67c6b91b351c081993fe715a.mockapi.io/stockSummary');
  let data = await response.json();
  return data;
};

export default function Report() {
  // const { stockDetails, stockSummary } = useLoaderData();

  const [stockDetails, setStockDetails] = useState([]);
  const [stockSummary, setStockSummary] = useState([]);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isValidDate, setIsValidDate] = useState(false);
  const { filterByDate } = useDateFilter();

  useEffect(() => {
    const loadData = async () => {   
        const [details, summary] = await Promise.all([
          fetchStockDetails(),
          fetchStockSummary(),
        ]);
        setStockDetails(details);
        setStockSummary(summary);
    };
    loadData();
  }, []);

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

  console.log(stockDetails, stockSummary);

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
                  filterByDate(stockS.docDate, fromDate, toDate) && 
                isValidDate
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
                                  filterByDate(stockD.docDate, fromDate, toDate) &&
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
