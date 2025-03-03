import useCalPreGrn from "./useCalPreGrn";


export function usePurchaseStatusUpdate() {

const useCalPre = useCalPreGrn();
    
  function updatePoStatus(grnDetail) {
    // const grnMaster = JSON.parse(localStorage.getItem('grnMaster')) || [];
    let poMaster = JSON.parse(localStorage.getItem("poMaster")) || [];
   console.log(grnDetail,"Grn detai;")

    grnDetail.items.forEach((element) => {
      console.log(useCalPre(grnDetail.Vendor,element.po_id, element.itemDetail_id));
      if (
        Number(element.grnQty) + Number(useCalPre(grnDetail.Vendor,element.po_id, element.itemDetail_id)) ==
        Number(element.qty)
      ) {
        let currItems = poMaster.find(
          (po) => po.po_id === element.po_id
        )?.itemDetails;
        currItems[
          currItems.findIndex(
            (itm) => itm.itemDetail_id === element.itemDetail_id
          )
        ].itemStatus = "completed";
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
        ].itemStatus = "pending";
        poMaster[
          poMaster.findIndex((po) => po.po_id === element.po_id)
        ].itemDetails = currItems;
      }
    });

    grnDetail.PurchaseOrder.forEach((element) => {
      poMaster = poMaster.map((el) => {
        const status = el.itemDetails.every((itm) => {
          if (itm.itemStatus === "completed") return true;
          return false;
        });
        return {
          ...el,
          poStatus: status ? "completed" : "pending",
        };
      });
    });

    console.log(poMaster, "*******************");
    localStorage.setItem('poMaster',JSON.stringify(poMaster));
  }


  return { updatePoStatus };
}
