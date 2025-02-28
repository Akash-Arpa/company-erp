export function useCalculateAmount() {
  function reCalculate(id,formData, currTaxes) {
    const currItem = formData.itemDetails.find((el) => el.itemDetail_id === id);
    const sumOfTaxes = currTaxes.reduce((acc, el) => {
      if (el.itemDetail_id === id) {
        acc += Number(el.tax_amount);
      }
      return acc;
    }, 0);
    return (currItem.rate * currItem.qty + Number(sumOfTaxes)).toFixed(2);
  }

  function getTaxAmount(data, item) {
    if (
      data.tax_name != "" &&
      data.calculated_as != "" &&
      data.tax_rate != ""
    ) {
      if (data.nature === "Add" && data.calculated_as === "%")
        return ((item.rate * item.qty * data.tax_rate) / 100).toFixed(2);
      if (data.nature === "Add" && data.calculated_as === "Unit")
        return (item.qty * data.tax_rate).toFixed(2);
      if (data.nature === "Add" && data.calculated_as === "Amt")
        return Number(data.tax_rate).toFixed(2);
      if (data.calculated_as === "%")
        return (0 - (item.rate * item.qty * data.tax_rate) / 100).toFixed(2);
      if (data.calculated_as === "Unit")
        return (0 - item.qty * data.tax_rate).toFixed(2);
      if (data.calculated_as === "Amt")
        return Number(0 - data.tax_rate).toFixed(2);
    }
    return "";
  }

  return {
    reCalculate,
    getTaxAmount,
  };
}
