export function useLot() {
  const stockDetails = JSON.parse(localStorage.getItem("stockDetails")) || [];

  function getLot(item_id, date) {
    return stockDetails.reduce((acc, stockDetail) => {
      if (stockDetail.itemNo === item_id && stockDetail.docDate <= date) {
        const idx = acc.findIndex((el) => el.stock_id === stockDetail.stock_id);
        if (idx != -1) {
          acc[idx].stockQty =
            Number(acc[idx].stockQty) + Number(stockDetail.recieved);
          acc[idx].balance =
            Number(acc[idx].balance) +
            Number(stockDetail.recieved) -
            Number(stockDetail.issued);
        } else {
          acc.push({
            stock_id: stockDetail.stock_id,
            docNo: stockDetail.docNo,
            docDate: stockDetail.docDate,
            stockQty: stockDetail.recieved,
            balance: Number(stockDetail.recieved) - Number(stockDetail.issued),
          });
        }
      }
      return acc;
    }, []);
  }

  return { getLot };
}
