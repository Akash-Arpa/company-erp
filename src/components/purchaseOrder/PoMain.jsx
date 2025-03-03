import React, { useEffect, useState } from "react";
import "./Po.css";
import ItemGrid from "./ItemGrid";
import  useFetch  from "../../hooks/useFetch";
import { useCalculateAmount } from "../../hooks/useCalculateAmount";
import GeneralDetail from "./GeneralDetail";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

const initialItemState = {
  itemDetail_id: +new Date(),
  item_id: "",
  item_name: "",
  qty: "",
  rate: "",
  netAmount: "",
  itemStatus: "pending",
};
const initialState = {
  po_id: +new Date(),
  poStatus: "pending",
  poNo: "",
  poDate: "",
  customer_id: "",
  itemDetails: [{ ...initialItemState }],
  taxDetails: [],
  scheduleDetails: [],
  totalBasic: 0,
  totalTax: 0,
};
const PoMain = () => {
  const [poMaster, setPoMaster] = useLocalStorage("poMaster");
  const [poList, setPoList] = useState(poMaster);
  const [formData, setFormData] = useState(initialState);
  const [itemMaster, setItemMaster] = useState();
  const [customerMaster, setCustomerMaster] = useState();
  const [taxMaster, setTaxMaster] = useState();
  const navigate = useNavigate();

  const fetchAll = async () => {
    const itemData = await useFetch(
      "https://dummyjson.com/c/6e58-6906-42c4-9164"
    );
    const customerData = await useFetch(
      "https://dummyjson.com/c/5b1a-4be8-4fde-a8bf"
    );

    const taxData = await useFetch(
      "https://dummyjson.com/c/c3ac-1cc1-41d1-acd3"
    );
    setItemMaster(itemData);
    setCustomerMaster(customerData);
    setTaxMaster(taxData);

    if (localStorage.getItem("editPoId")) {
      fillData();
    }
  };

  const fillData = () => {
    const id = Number(localStorage.getItem("editPoId"));
    const currPo = { ...poList.find((el) => el.po_id === id) };
    currPo.poNo = currPo.poNo.slice(2, 10);
    currPo.itemDetails = [...currPo.itemDetails, { ...initialItemState }];
    console.log(currPo, initialItemState);
    setFormData((prev) => currPo);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const { reCalculate } = useCalculateAmount();

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.name === "customer_id") {
      setFormData((prev) => {
        return {
          ...prev,
          [e.target.name]: Number(e.target.value),
        };
      });

      return;
    }
    setFormData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleTaxAdd = (value, id) => {
    setFormData((prev) => {
      const updatedList = prev.taxDetails.filter(
        (el) => el.itemDetail_id != id
      );

      const newItemList = prev.itemDetails.map((itm) => {
        if (itm.itemDetail_id === id) {
          return {
            ...itm,
            netAmount: Number(
              value.reduce(
                (acc, el) => (acc += Number(el.tax_amount)),
                itm.qty * itm.rate
              )
            ).toFixed(2),
          };
        }
        return itm;
      });

      return {
        ...prev,
        itemDetails: newItemList,
        taxDetails: [...updatedList, ...value],
      };
    });
  };

  const handleScheduleAdd = (value, id) => {
    setFormData((prev) => {
      const updatedList = prev.scheduleDetails.filter(
        (el) => el.itemDetail_id != id
      );

      return {
        ...prev,
        scheduleDetails: [...updatedList, ...value],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", formData);
    let newFormData = { ...formData };

    if (newFormData.itemDetails.length === 0) {
      alert("Add Item");
      return;
    }
    if (newFormData.taxDetails.length === 0) {
      alert("Add Tax");
      return;
    }
    if (newFormData.scheduleDetails.length === 0) {
      alert("Add Schedule");
      return;
    }
    if (!scheduleMismatch(formData.itemDetails, formData.scheduleDetails)) {
      alert("Some Schedule is Mismatching");
      return;
    }
    newFormData.itemDetails = newFormData.itemDetails.filter(el=>el.item_id != " " && el.netAmount != "");
    newFormData.poNo = "PO" + newFormData.poNo.padStart(8, "0");
    newFormData.itemDetails = newFormData.itemDetails.map((el) => {
      return {
        ...el,
        po_id: newFormData.po_id,
      };
    });

    uploadData(newFormData);

    const id = Number(localStorage.getItem("editPoId"));
    if (id) {
      const updatedList = [...poList];
      const index = poList.findIndex((el) => el.po_id === id);
      updatedList.splice(index, 1, newFormData);
      setPoList((prev) => {
        return [...updatedList];
      });
    } else {
      setPoList((prev) => {
        return [...prev, newFormData];
      });
    }
    resetForm();
  };

  const scheduleMismatch = (items, schedules) => {
    return items.every((item) => {
      const total = schedules.reduce((acc, el) => {
        if (el.itemDetail_id === item.itemDetail_id)
          acc += Number(el.schedule_qty);
        return acc;
      }, 0);

      if (total === Number(item.qty)) return true;
      return false;
    });
  };

  useEffect(() => {
    const newBasic = formData.itemDetails.reduce(
      (acc, el) => (acc += Number(el.rate * el.qty)),
      0
    );
    const newTax = formData.taxDetails.reduce(
      (acc, el) => (acc += Number(el.tax_amount)),
      0
    );
    setFormData((prev) => {
      return {
        ...prev,
        totalBasic: newBasic.toFixed(2),
        totalTax: newTax.toFixed(2),
      };
    });
  }, [formData.itemDetails, formData.taxDetails]);

  useEffect(() => {
    setPoMaster(poList);
  }, [poList]);

  const handleDelete = () => {
    const id = Number(localStorage.getItem("editPoId"));
    if (id) {
      let updatedList = [...poList];
      updatedList = updatedList.filter((el) => el.po_id != id);
      setPoList((prev) => [...updatedList]);
      resetForm();
    } else {
      alert("First Save the PO before deleting!!");
    }
  };

  const resetForm = () => {
    initialState.po_id = +new Date();
    initialState.itemDetails = [{ ...initialItemState }];
    setFormData((prev) => ({ ...initialState }));
    localStorage.removeItem("editPoId");
  };

  const uploadData = async (data) => {
    const response = await fetch(
      "https://67c168b561d8935867e2e089.mockapi.io/api/poMaster/purchaseOrder",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const resdata = await response.json();
    for (let i = 0; i < data.itemDetails.length; i++) {
      console.log("ajson", JSON.stringify(data.itemDetails[i]));
      const response_itemDetails = await fetch(
        `https://67c168b561d8935867e2e089.mockapi.io/api/poMaster/purchaseOrder/${resdata.id}/itemDetails`,
        {
          method: "POST",
          body: JSON.stringify(data.itemDetails[i]),
        }
      );
    }
    console.log(resdata);
  };

  return (
    <div className="po-main-container">
      <form onSubmit={handleSubmit} className="po-form">
        <div className="button-wrapper">
          <button type="button" onClick={resetForm}>
            New
          </button>
          <button type="submit">Save</button>
          <button
            type="button"
            onClick={() => {
              navigate("/po-search");
            }}
          >
            Search
          </button>
          <button type="button" onClick={handleDelete}>
            Delete
          </button>
        </div>
        <div className="head-input-container">
          <div className="input-container">
            <div className="input-wrapper">
              <label htmlFor="poNo">Po No</label>
              <input
                type="text"
                required
                maxLength={8}
                value={formData.poNo}
                onChange={handleChange}
                name="poNo"
                id="poNo"
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="poDate">Po Date</label>
              <input
                type="date"
                name="poDate"
                required
                value={formData.poDate}
                onChange={handleChange}
                id="poDate"
              />
            </div>
          </div>
          <div className="input-wrapper">
            <label htmlFor="customer_id">Customer Name</label>
            <select
              required
              name="customer_id"
              value={formData.customer_id}
              onChange={handleChange}
              id="customer_id"
            >
              <option value="" disabled>
                ----Select One Customer----
              </option>
              {customerMaster &&
                customerMaster.map((customer) => {
                  return (
                    <option key={customer.id} value={customer.id}>
                      {customer.customer_name}
                    </option>
                  );
                })}
            </select>
          </div>
        </div>
        {itemMaster && (
          <ItemGrid
            itemMaster={itemMaster}
            taxMaster={taxMaster}
            onTaxAdd={handleTaxAdd}
            formData={formData}
            items={formData.itemDetails}
            setFormData={setFormData}
            onScheduleAdd={handleScheduleAdd}
          />
        )}
        <GeneralDetail
          totalBasic={formData.totalBasic}
          totalTax={formData.totalTax}
        />
      </form>
    </div>
  );
};

export default PoMain;
