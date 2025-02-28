import React, { useEffect, useRef, useState } from "react";
import SelectTag from "./SelectTag";
import TaxModal from "./Modals/TaxModal";
import { useCalculateAmount } from "../../hooks/useCalculateAmount";
import ScheduleModal from "./Modals/ScheduleModal";

const initialState = {
  itemDetail_id: +new Date(),
  item_id: "",
  item_name: "",
  qty: "",
  rate: "",
  netAmount: "",
  itemStatus: "pending",
};

const ItemGrid = ({
  onScheduleAdd,
  itemMaster,
  taxMaster,
  onTaxAdd,
  formData,
  items,
  setFormData,
}) => {
  //   const [items, setItems] = useState([{ ...initialState }]);
  const [taxItem, setTaxItem] = useState();
  const [scheduleItem, setScheduleItem] = useState();
  const [sOpen, setSOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { reCalculate, getTaxAmount } = useCalculateAmount();
  const dialogRef = useRef();
  const sDialogRef = useRef();
  //   const itemRef = useRef();

  const handleChange = (e, id) => {
    e.preventDefault();
    let currItem = items.find((item) => item.itemDetail_id === id);
    const currIndex = items.findIndex((item) => item.itemDetail_id === id);
    if (
      e.target.name === "item_id" &&
      currItem[e.target.name] === "" &&
      currIndex === items.length - 1
    ) {
      currItem[e.target.name] = e.target.value;
      currItem.item_name = itemMaster.find(
        (el) => el.id === e.target.value
      )?.item_name;
      setFormData((prev) => {
        let updatedList = [...prev.itemDetails];
        updatedList.splice(currIndex, 1, currItem);
        initialState.itemDetail_id = +new Date();
        // console.log(newState, "<----NewState");
        return {
          ...prev,
          itemDetails: [...updatedList, { ...initialState }],
        };
      });
      return;
    }
    // console.log("currItem");
    if (e.target.name === "rate" || e.target.name === "qty") {
      let currTaxes = formData.taxDetails.map((el) => {
        if (el.itemDetail_id === id)
          return {
            ...el,
            tax_amount: getTaxAmount(el, currItem),
          };
        return el;
      });
      currItem.netAmount = reCalculate(id, formData, currTaxes);
      currItem[e.target.name] = e.target.value;
      setFormData((prev) => {
        let updatedList = [...prev.itemDetails];
        updatedList.splice(currIndex, 1, currItem);
        return {
          ...prev,
          itemDetails: updatedList,
          taxDetails: currTaxes,
        };
      });
      return;
    }
    currItem[e.target.name] = e.target.value;
    if (e.target.name === "item_id") {
      currItem.item_name = itemMaster.find(
        (el) => el.id === e.target.value
      )?.item_name;
    }
    setFormData((prev) => {
      let updatedList = [...prev.itemDetails];
      updatedList.splice(currIndex, 1, currItem);
      return {
        ...prev,
        itemDetails: updatedList,
      };
    });
  };

  const handleBlur = (e, val, id) => {
    e.target.value = Number(e.target.value).toFixed(val);
    handleChange(e, id);
  };

  const handleTaxClick = (e, item) => {
    setTaxItem((prev) => {
      return item;
    });
    setOpen(true);
    dialogRef.current.showModal();
  };
  const handleScheduleClick = (e, item) => {
    setScheduleItem((prev) => {
      return item;
    });
    setSOpen(true);
    sDialogRef.current.showModal();
  };

  return (
    <>
      <dialog ref={dialogRef}>
        {open && (
          <TaxModal
            formData={formData}
            item={taxItem}
            itemMaster={itemMaster}
            taxMaster={taxMaster}
            dialogRef={dialogRef}
            onTaxAdd={onTaxAdd}
            setOpen={setOpen}
          />
        )}
      </dialog>
      <dialog ref={sDialogRef}>
        {sOpen && (
          <ScheduleModal
            setSOpen={setSOpen}
            sDialogRef={sDialogRef}
            onScheduleAdd={onScheduleAdd}
            item={scheduleItem}
            formData={formData}
          />
        )}
      </dialog>
      <table border={1} className="item-grid">
        <thead>
          <tr>
            <td>Sno.</td>
            <td>Item Name</td>
            <td>Qty</td>
            <td>Schedule</td>
            <td>Rate</td>
            <td>Basic Amount</td>
            <td>Tax</td>
            <td>Net Amount</td>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  {
                    <SelectTag
                      name={"item_id"}
                      value={item.item_id}
                      options={itemMaster}
                      optionName={"item_name"}
                      onChange={handleChange}
                      id={item.itemDetail_id}
                    />
                  }
                </td>
                <td className="text-right">
                  {
                    <input
                      type="number"
                      step={0.001}
                      onBlur={(e) => handleBlur(e, 3, item.itemDetail_id)}
                      name="qty"
                      value={item.qty}
                      onChange={(e) => handleChange(e, item.itemDetail_id)}
                    />
                  }
                </td>
                <td>
                  <button
                    type="button"
                    onClick={(e) => handleScheduleClick(e, item)}
                  >
                    Add Schedule
                  </button>
                </td>
                <td className="text-right">
                  {
                    <input
                      type="number"
                      step={0.0001}
                      onBlur={(e) => handleBlur(e, 4, item.itemDetail_id)}
                      name="rate"
                      value={item.rate}
                      onChange={(e) => handleChange(e, item.itemDetail_id)}
                    />
                  }
                </td>
                <td className="text-right">
                  {(item.rate * item.qty).toFixed(2)}
                </td>
                <td className="text-right">
                  <button
                    type="button"
                    onClick={(e) => handleTaxClick(e, item)}
                  >
                    Add Tax
                  </button>
                </td>
                <td className="text-right">{item.netAmount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default ItemGrid;
