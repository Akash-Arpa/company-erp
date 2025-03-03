import useCalPreGrn from "./useCalPreGrn";

export function usePurchaseStatusUpdate() {
    const calcPreGrn = useCalPreGrn();
  function updatePoStatus(grnDetail) {
    // const grnMaster = JSON.parse(localStorage.getItem('grnMaster')) || [];
    let poMaster = JSON.parse(localStorage.getItem("poMaster")) || [];

    grnDetail.items.forEach((element) => {
      if (
        Number(element.grnQty) + Number(calcPreGrn(grnDetail.vendor,element.po_id,element.itemDetail_id)) ==
        Number(element.qty)
      ) {
        let currItems = poMaster.find(
          (po) => po.po_id === element.po_id
        )?.itemDetails;
        currItems[
          currItems.findIndex(
            (itm) => itm.itemDetail_id === element.itemDetail_id
          )
        ].status = "completed";
        poMaster[
          poMaster.findIndex((po) => po.po_id === element.po_id)
        ].itemDetails = currItems;
      } else {
        let currItems = poMaster.find(
          (po) => po.po_id === element.po_id
        )?.itemDetails;
        currItems[
          currItems.findIndex(
            (itm) => itm.itemDetail_id === element.itemDetail_id
          )
        ].status = "pending";
        poMaster[
          poMaster.findIndex((po) => po.po_id === element.po_id)
        ].itemDetails = currItems;
      }
    });

    grnDetail.PurchaseOrder.forEach((element) => {
      poMaster = poMaster.map((el) => {
        const status = el.itemDetails.every((itm) => {
          if (itm.status === "completed") return true;
          return false;
        });
        return {
          ...el,
          status: status ? "completed" : "pending",
        };
      });
    });
  }

  return { updatePoStatus };
}
