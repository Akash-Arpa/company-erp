import { useState } from "react";
import useLocalStorage from "./useLocalStorage";

export function useStock() {
  const [stockSummary, setStockSummary] = useLocalStorage("stockSummary", []);
  const [stockDetail, setStockDetail] = useLocalStorage("stockDetail", []);
  const [error, setError] = useState("");

  const calculateStockSummary = (arg, arg2) => {
    let updatedStockSummary;
    arg2 ? updatedStockSummary = [...arg2] : updatedStockSummary = [...stockSummary];
    updatedStockSummary.forEach((entry) => {
      let currStockId = entry.stock_id;
      let totalIssued = arg
        .filter((detail) => {
          if (detail.stock_id === currStockId) console.log(detail);
          return detail.stock_id === currStockId
        }
        )
        .reduce((sum, detail) => sum + parseFloat(detail.issued || 0), 0);
      entry.issued = totalIssued;
      entry.balance = parseFloat(entry.recieved) - totalIssued;
    });

    setStockSummary(updatedStockSummary);
  };

  const setInsert = (entries) => {
    if (!Array.isArray(entries) || entries.length === 0) return;

    const newSummaryEntries = [];
    const newDetailEntries = [];

    entries.forEach(entry => {
      const { formCode, poNo, item_id, docNo, docNoYearly, docDate, qty } = entry;
      const stock_id = Date.now() + Math.floor(Math.random() * 1000) + newSummaryEntries.length;
      newSummaryEntries.push({
        stock_id,
        docNo,
        docNoYearly,
        docDate,
        poNo,
        item_id,
        recieved: parseFloat(qty),
        issued: 0,
        balance: parseFloat(qty),
        formCode,
      });

      newDetailEntries.push({
        stockDetail_id: Date.now() + Math.floor(Math.random() * 1000) + newDetailEntries.length,
        stock_id,
        docNo,
        docNoYearly,
        docDate,
        poNo,
        item_id,
        recieved: parseFloat(qty),
        issued: 0,
        formCode,
      });
    });

    setStockSummary(prevSummary => [...newSummaryEntries, ...prevSummary]);
    setStockDetail(prevDetail => [...newDetailEntries, ...prevDetail]);
  };

  const setUpdate = (entries) => {
    if (!Array.isArray(entries) || entries.length === 0) return;
    const newDetailEntries = [];

    entries.forEach(entry => {
      const { formCode, poNo, item_id, docNo, docNoYearly, docDate, qty, stock_id } = entry;

      let targetStockId = stock_id;
      if (!targetStockId) {
        const matchingStock = stockSummary.find(
          item => item.poNo === poNo && item.item_id === item_id
        );
        if (matchingStock) {
          targetStockId = matchingStock.stock_id;
        } else {
          console.error(No matching stock found for update: PO=${poNo}, Item=${item_id});
          return;
        }
      }

      newDetailEntries.push({
        stockDetail_id: Date.now() + Math.floor(Math.random() * 1000) + newDetailEntries.length,
        stock_id: targetStockId,
        docNo,
        docNoYearly,
        docDate,
        poNo,
        item_id,
        recieved: 0,
        issued: parseFloat(qty),
        formCode,
      });
    });

    setStockDetail(prev => [...newDetailEntries, ...prev]);
    calculateStockSummary([...newDetailEntries, ...stockDetail]);
  };

  // const setDelete = (formCode, docNo, item_id) => {


  //   let updatedStockDetail;

  //   if (formCode === "IGRN") {

  //     stockSummary.filter(it => it.docNo === docNo).forEach(e => {
  //       if (stockDetail.filter(it => it.stock_id === e.stock_id).find(ele => ele.formCode === "IMI")) {
  //         setError("Cannot Delete a GRN that has an issued item")
  //         return;
  //       }
  //     })
  //     stockSummary.filter(it => it.docNo === docNo).forEach(e => {
  //       setStockDetail(prev => {
  //         updatedStockDetail = prev.filter(it => it.stock_id !== e.stock_id)
  //         return updatedStockDetail;
  //       })
  //     })
  //     setStockSummary(prev => {
  //       updatedStockDetail = prev.filter(it => it.docNo !== docNo);
  //       return updatedStockDetail;
  //     })

  //     setError("Deleted Successfully")
  //     return;
  //   }
  //   else if (formCode === "IMI") {
  //     if (item_id) {
  //       setStockDetail(prev =>
  //         prev.filter(item => !(item.docNo === docNo && item.item_id === item_id))
  //       );
  //     }
  //     else {
  //       setStockDetail(prev =>
  //         prev.filter(item => !(item.docNo === docNo && item.formCode === "IMI"))
  //       );
  //     }
  //   }

  //   calculateStockSummary();
  // };

  const setDelete = (formCode, docNo, item_id) => {
    let updateStockDetail = []
    let updateStockSummary = [...stockSummary]
    if (formCode === "IGRN") {
      const hasIssuedItem = stockSummary
        .filter(it => it.docNo === docNo)
        .some(e => stockDetail.some(it => it.stock_id === e.stock_id && it.formCode === "IMI"));

      if (hasIssuedItem) {
        setError("Cannot delete a GRN that has an issued item");
        return;
      }

      setStockDetail(prev => {
        updateStockDetail = [...prev];
        updateStockDetail = updateStockDetail.filter(it => !stockSummary.some(e => e.docNo === docNo && it.stock_id === e.stock_id));
        return updateStockDetail;
      });
      setStockSummary(prev => {
        updateStockSummary = prev.filter(it => it.docNo !== docNo)
        return updateStockSummary
      });

      setError("Deleted Successfully");
    }
    else if (formCode === "IMI") {
      setStockDetail(prev => {
        updateStockDetail = [...prev];
        updateStockDetail = updateStockDetail.filter(item => item.docNo !== docNo || (item_id && item.item_id !== item_id))
        return updateStockDetail;
      });
    }

    calculateStockSummary(updateStockDetail,updateStockSummary);
  };

  return [
    error,
    setInsert,
    setUpdate,
    setDelete,
  ];
}
