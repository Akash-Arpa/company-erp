import React, { useEffect, useState } from "react";
import SelectTag from "../SelectTag";
import { useCalculateAmount } from "../../../hooks/useCalculateAmount";

const CALCULATED_AS = [
  { id: "%", calculated_as: "%" },
  { id: "Amt", calculated_as: "Amt" },
  { id: "Unit", calculated_as: "Unit" },
];

const TaxModal = ({
  item,
  taxMaster,
  dialogRef,
  onTaxAdd,
  formData,
  setOpen,
}) => {
  const initialState = {
    taxDetail_id: +new Date(),
    tax_id: "",
    nature: "",
    calculated_as: "",
    tax_rate: "",
    tax_amount: "",
    itemDetail_id: item.itemDetail_id,
  };

  const [taxes, setTaxes] = useState([
    ...formData.taxDetails.filter(
      (el) => el.itemDetail_id === item.itemDetail_id
    ),
    { ...initialState },
  ]);
  const { getTaxAmount, reCalculate } = useCalculateAmount();

  const handleChange = (e, id) => {
    let currItem = taxes.find((item) => item.taxDetail_id === id);
    const currIndex = taxes.findIndex((item) => item.taxDetail_id === id);

    if (
      e.target.name === "tax_id" &&
      currItem[e.target.name] === "" &&
      currIndex === taxes.length - 1
    ) {
      currItem[e.target.name] = Number(e.target.value);
      currItem.nature = taxMaster.find((el) => el.id == e.target.value)?.nature;
      currItem.tax_amount = getTaxAmount(currItem, item);
      setTaxes((prev) => {
        let updatedList = [...prev];
        updatedList.splice(currIndex, 1, currItem);
        initialState.taxDetail_id = +new Date();
        return [...updatedList, { ...initialState }];
      });
      return;
    }

    currItem[e.target.name] = e.target.value;
    if (e.target.name === "tax_id") {
      currItem.nature = taxMaster.find((el) => el.id == e.target.value)?.nature;
      currItem[e.target.name] = Number(e.target.value);
    }
    currItem.tax_amount = getTaxAmount(currItem, item);
    setTaxes((prev) => {
      let updatedList = [...prev];
      updatedList.splice(currIndex, 1, currItem);
      return updatedList;
    });
  };

  //   const getTaxAmount = (data) => {
  //     if (
  //       data.tax_id != "" &&
  //       data.calculated_as != "" &&
  //       data.tax_rate != ""
  //     ) {
  //       if (data.nature === "Add" && data.calculated_as === "%")
  //         return ((item.rate * item.qty * data.tax_rate) / 100).toFixed(2);
  //       if (data.nature === "Add" && data.calculated_as === "Unit")
  //         return (item.qty * data.tax_rate).toFixed(2);
  //       if (data.nature === "Add" && data.calculated_as === "Amt")
  //         return Number(data.tax_rate).toFixed(2);
  //       if (data.calculated_as === "%")
  //         return (0 - (item.rate * item.qty * data.tax_rate) / 100).toFixed(2);
  //       if (data.calculated_as === "Unit")
  //         return (0 - item.qty * data.tax_rate).toFixed(2);
  //       if (data.calculated_as === "Amt")
  //         return Number(0 - data.tax_rate).toFixed(2);
  //     }
  //     return "";
  //   };

  const handleBlur = (e, val, id) => {
    e.target.value = Number(e.target.value).toFixed(val);
    handleChange(e, id);
  };

  const handleAdd = (list) => {
    const updatedList = list.slice(0, list.length - 1);
    onTaxAdd(updatedList, item.itemDetail_id);
    setOpen((prev) => !prev);
    dialogRef.current.close();
  };

  return (
    <>
      <table border={1} className="item-grid">
        <thead>
          <tr>
            <td>Sno.</td>
            <td>Tax Name</td>
            <td>Nature</td>
            <td>Calculated As</td>
            <td>Tax Rate</td>
            <td>Tax Amount</td>
          </tr>
        </thead>
        <tbody>
          {taxes.map((item, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  {
                    <SelectTag
                      name={"tax_id"}
                      value={`${item.tax_id}`}
                      options={taxMaster}
                      optionName={'tax_name'}
                      onChange={handleChange}
                      id={item.taxDetail_id}
                    />
                  }
                </td>
                <td className="text-right">{item.nature}</td>
                <td>
                  {
                    <SelectTag
                      name={"calculated_as"}
                      value={item.calculated_as}
                      optionName={"calculated_as"}
                      options={CALCULATED_AS}
                      onChange={handleChange}
                      id={item.taxDetail_id}
                    />
                  }
                </td>
                <td className="text-right">
                  {
                    <input
                      type="number"
                      step={0.0001}
                      onBlur={(e) => handleBlur(e, 4, item.taxDetail_id)}
                      name="tax_rate"
                      value={item.tax_rate}
                      onChange={(e) => handleChange(e, item.taxDetail_id)}
                    />
                  }
                </td>
                <td className="text-right">{item.tax_amount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button type="button" onClick={() => handleAdd(taxes)}>
        Add Tax
      </button>
    </>
  );
};

export default TaxModal;
