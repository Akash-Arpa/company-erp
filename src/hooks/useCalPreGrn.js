function useCalPreGrn() {
    let grnList = JSON.parse(localStorage.getItem("GRN")) || [];
  
    return (vendorId, poId, itemId, grnQty = 0) => {
      let totalQty = 0;
  
      grnList.forEach((grn) => {
        if (grn.Vendor === vendorId) {
          grn.items.forEach((item) => {
            if (item.itemDetail_id == itemId && item.po_id == poId) {
              totalQty += Number(item.grnQty);
            }
          });
        }
      });
      return totalQty - grnQty;
    };
  }
  
  export default useCalPreGrn;