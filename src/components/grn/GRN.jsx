import React, { useState, useEffect, useRef } from "react";

import useCalPreGrn from "../../hooks/useCalPreGrn";
import { useFetchData } from "../../hooks/useFetch";
import { usePurchaseStatusUpdate } from "../../hooks/usePurchaseStatusUpdate";
import { useStock } from "../../hooks/useStockService";
import Home from "../Home";

function initialForm() {
  return {
    GRN_id: +new Date(),
    DocNo: "GRN",
    DocDate: "",
    DocStatus: "",
    Vendor: "",
    PurchaseOrder: [],
    items: [],
  };
}

export default function GRN() {
  const [purchaseOrder, setPurchaseOrder] = useState([]);
  const [Grn, setGrn] = useState([]);
  const [grnForm, setGrnForm] = useState({ ...initialForm() });
  const [activePO, setActivePO] = useState([]);
  const [showPO, setShowPO] = useState(false);
  const [items, setItems] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [editingID, setEditingID] = useState("");
  const   [
    error,
    setInsert,
    setUpdate,
    setDelete,
  ] = useStock();
  const {updatePoStatus} = usePurchaseStatusUpdate();

  useEffect(() => {
    let list = JSON.parse(localStorage.getItem("poMaster")) || [];
    let grnList = JSON.parse(localStorage.getItem("GRN")) || [];
    setGrn((prev) => {
      return grnList;
    });
   // console.log(list);
    setPurchaseOrder((prev) => {
      return list;
    });
  }, []);

  //+++++++++++++++++++++++++++++++++Custom Hook++++++++++++++++++++++++++++++++++++++
  let CustomerList = useFetchData(
    "https://dummyjson.com/c/5b1a-4be8-4fde-a8bf"
  );
  const useCalGrn = useCalPreGrn();

  const handleChange = (e) => {
    if (e.target.name === "Vendor") {
      vendorSelection(e.target.value);
      setGrnForm((prev) => {
     //   console.log(e.target.id);
        return {
          ...prev,
          VendorName: e.target.id,
          [e.target.name]: e.target.value,
        };
      });
      return;
    }
    setGrnForm((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const vendorSelection = (id) => {
    let po = purchaseOrder.filter((ele) => {
      // console.log(ele.customer_id, id);
      return ele.customer_id == id && ele.poStatus == "pending";
    });

    setItems((prev) => {
      return [];
    });
    setActivePO((prev) => {
      return po;
    });
    setShowPO((prev) => {
      return true;
    });
  };

  const POSelection = (e, id) => {
    if (e.target.checked) {
      activePO.forEach((po) => {
        if (po.po_id == id) {
          setGrnForm((prev) => {
            prev.PurchaseOrder = [
              ...prev.PurchaseOrder,
              {
                po_id: po.po_id,
                poNo: po.poNo,
                poDate: po.poDate,
                isSelected: true,
              },
            ];

            setItems((pre) => {
              let up = po.itemDetails.filter((ele) => {
                return ele.itemStatus === "pending";
              });
              up = up.map((ele) => {
                return {
                  ...ele,
                  grnQty: 0,
                  preGrnQty: parseFloat(
                    useCalGrn(
                      grnForm.Vendor,
                      ele.po_id,
                      ele.itemDetail_id,
                      ele.grnQty
                    )
                  ).toFixed(3),
                };
              });
              return [...pre, ...up];
            });
            prev.items = [];
            // console.log(prev,"from poselection")
            return prev;
          });
        }
      });
      return;
    } else {
      setItems((prev) => {
        let up = prev.filter((ele) => {
          return ele.po_id != id;
        });
        return up;
      });
    }
  };

  const itemSelection = (e, itemId, index) => {
    if (e.target.checked) {
      setGrnForm((prev) => {
        items[index].isSelected = true;
        // console.log(prev,"prev^^^^^^^^^^^^^^^^")
       let updatedItem = prev;
      
       updatedItem.items = [...prev.items, items[index]];
        // console.log( updatedItem,"itemSelection")
        return updatedItem;
      });
    } else {
      setGrnForm((prev) => {
        prev.items = prev.items.filter((ele) => {
          return ele.itemDetail_id !== itemId;
        });
        return { ...prev };
      });
    }
  };

  const formValidation = () => {
    if (grnForm.DocNo === "" && grnForm.DocNo.length <= 8) {
      alert("Please enter Document No");
      return false;
    }
    if (grnForm.DocDate === "") {
      alert("Please enter Document Date");
      return false;
    }
    if (grnForm.DocStatus === "Default" || grnForm.DocStatus === "") {
      alert("Please select Document Status");
      return false;
    }
    if (grnForm.Vendor === "Default" || grnForm.Vendor === "") {
      alert("Please select Vendor");
      return false;
    }
    if (grnForm.PurchaseOrder.length === 0) {
      alert("Please select Purchase Order");
      return false;
    }
    if (grnForm.items.length === 0) {
      alert("Please select Items");
      return false;
    }
    return true;
  };

  const save = () => {
    if (!formValidation()) {
      return;
    }
    if (editingID !== "") {
      let updated = Grn.filter((ele) => {
        return ele.GRN_id !== editingID;
      });
      let orgData = organizeData( grnForm);
     
      setInsert(orgData);
     
      setGrn((prev) => {
        localStorage.setItem("GRN", JSON.stringify( [...updated, grnForm]));
        return [...updated, grnForm];
      });
      setEditingID((prev) => {
        return "";
      });
    } else {
      setGrn((prev) => {
        let orgData = organizeData(grnForm);
         setInsert(orgData);
        // console.log(orgData,"9876546546");
        localStorage.setItem("GRN", JSON.stringify([...prev, grnForm]));
        return [...prev, grnForm];
      });
    }
    updatePoStatus(grnForm);
    alert("GRn Saved Successfully!");
    setNew();
  };

  // { formCode, poNo, itemNo, docNo, docNoYearly, docDate, qty }
  const organizeData = (grnData) => {
    let data = [];
    grnData.items.forEach((item) => {
        data = [
          ...data,
          {
            docNo: grnForm.DocNo,
            docDate: grnForm.DocDate,
            docNoYearly: String(String(grnForm.DocNo) + "Y"),
            // poNo: item.po_id,
            item_id: item.item_id,
            formCode: "IGRN",
            qty: item.grnQty,
          },
        ];
      });

    return data;
  };

  const setNew = () => {
    setGrnForm((prev) => {
      return { ...initialForm() };
    });
    setItems((prev) => {
      return [];
    });
    setActivePO((prev) => {
      return [];
    });
  };

  const DeleteGrn = () => {
   
    if (editingID === "") {
      alert("Please select a GRN to delete");
      return;
    }
    setDelete("IGRN", grnForm.DocNo);
    setGrn((prev) => {
      let up = prev.filter((ele) => {
        return ele.GRN_id !== grnForm.GRN_id;
      });
      localStorage.setItem("GRN", JSON.stringify(up));
      return up;
    });
    setNew();
  };

  const Search = () => {
    setShowSearch((prev) => {
      return true;
    });
  };

  const handleEdit = (id) => {
    setEditingID(id);

    setGrnForm((prev) => {
      let up = Grn.filter((ele) => {
        return ele.GRN_id == id;
      });
      setActivePO((prev) => {
        return [...up[0].PurchaseOrder];
      });
      setItems((prev) => {
        up[0].items.forEach((item) => {
         
          item.preGrnQty = parseFloat(
            useCalGrn(up[0].Vendor, item.po_id, item.itemDetail_id, item.grnQty)
          ).toFixed(3);
        });
        return [...up[0].items];
      });
      return up[0];
    });
    setShowSearch((prev) => {
      return false;
    });
  };

  const handleGrnQty = (e, index, itemId) => {
    // setItems((pre) => {
    //   console.log(pre[index]);
    //   pre[index].grnQty = e.target.value;
    //   return pre;
    // });
    setGrnForm((prev) => {
    
      prev.items.forEach((item) => {
        if (item.itemDetails_id === itemId) {
         
          item.grnQty = e.target.value;
        }
      });
      return prev;
    });
  };

  const handleG = (e, index) => {
    if (e.target.value > items[index].qty - items[index].preGrnQty) {
      setItems((pre) => {
        pre[index][e.target.name] = 0;
        return [...pre];
      });
      alert("Grn Qty should be less than or equal to balance qty");
      return;
    }
    setItems((pre) => {
      // console.log(pre[index].grnQty, index);
      pre[index][e.target.name] = e.target.value;
      return [...pre];
    });
  };

  const handleBlur = (e, index, itemId) => {
    const { name, value } = e.target;
    if (name === "DocNo") {
      setGrnForm((prev) => {
        return {
          ...prev,
          DocNo: "GRN" + String(Number(value.slice(3))).padStart(8, "0"),
        };
      });
    }
    if (name === "grnQty") {
      setItems((pre) => {
        // console.log(pre[index].grnQty, index);
        pre[index][name] = parseFloat(value).toFixed(3);
        return [...pre];
      });
    }
  };

  return (
    <>
  
      {!showSearch ? (
        <div>
           <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                marginLeft: "5px",
                marginBottom:"20px"
              }}
            >
              <button onClick={save}>Save</button>
              <button onClick={setNew}>New</button>
              <button onClick={DeleteGrn}>Delete</button>
              <button onClick={Search}>Open</button>
            </div>
          <div
            style={{
              display: "flex",
              alignItems: "start",
              justifyContent: "center",
            }}
          >
            <label htmlFor="DocNo"> Document No.</label>
            <input
              type="text"
              name="DocNo"
              value={grnForm.DocNo}
              onChange={(e) => {
                handleChange(e);
              }}
              onBlur={handleBlur}
            />
          </div>
          <div>
            <label htmlFor="DocDate"> Document Date</label>
            <input
              type="date"
              name="DocDate"
              value={grnForm.DocDate}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
          <div>
            <label htmlFor="DocStatus"> Document Status</label>
            <select
              name="DocStatus"
              value={grnForm.DocStatus}
              onChange={(e) => {
                handleChange(e);
              }}
            >
              <option value="Default">Select Status</option>
              <option value="Initial">Initial</option>
              <option value="Authorized">Authorized</option>
            </select>
          </div>
          <div>
            <label htmlFor="Vendor"> Vendor</label>
            <select
              name="Vendor"
              value={grnForm.Vendor}
              onChange={(e) => {
                handleChange(e);
              }}
            >
              <option value="Default">Select Vendor </option>
              {CustomerList.map((ele, index) => {
                return (
                  <option key={index} value={ele.id}>
                    {ele.customer_name}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
           
            <table border={1}>
              <thead>
                <tr>
                  <td>Select</td>
                  <td>PO No</td>
                  <td>PO Date</td>
                </tr>
              </thead>
              <tbody>
                {activePO.map((ele, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          defaultChecked={ele.isSelected}
                          onClick={(e) => {
                            POSelection(e, ele.po_id);
                          }}
                        />
                      </td>
                      <td>{ele.poNo}</td>
                      <td>{ele.poDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <table border={1} style={{ width: "800px", marginTop: "20px" }}>
              <thead>
                <tr>
                  <td>Select</td>
                  <td>PO No</td>
                  <td>PO Date</td>
                  <td>Item</td>
                  <td>PO Qty</td>
                  <td>Pre GRN Qty</td>
                  <td>Balance</td>
                  <td>GRN Qty</td>
                  <td>Rate</td>
                  <td>Amount</td>
                </tr>
              </thead>
              <tbody>
                {items.map((ele, index) => {
                  let poId = ele.po_id;
                  let po = grnForm.PurchaseOrder.find((p) => {
                    return p.po_id === poId;
                  });
                  return (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          defaultChecked={ele.isSelected}
                          onChange={(e) => {
                            itemSelection(e, ele.itemDetail_id, index);
                          }}
                        />
                      </td>
                      <td>{po.poNo}</td>
                      <td>{po.poDate}</td>
                      <td>{ele.item_name}</td>
                      <td>{ele.qty}</td>
                      <td>
                        <input type="number" readOnly value={ele.preGrnQty} />
                      </td>
                      <td>{ele.qty - ele.preGrnQty}</td>
                      <td>
                        <input
                          type="number"
                          name="grnQty"
                          value={ele.grnQty}
                          onChange={(e) => {
                            handleG(e, index);
                            handleGrnQty(e, index, ele.itemDetail_id);
                          }}
                          onBlur={(e) => {
                            handleBlur(e, index, ele.itemDetail_id);
                          }}
                        />
                      </td>
                      <td>{ele.rate}</td>
                      <td>{ele.netAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        //++++++++++++++++++++++Search Table+++++++++++++++++++++++++++++++++++++++++
        <div>
          <button
            onClick={() => {
              setShowSearch((prev) => {
                return false;
              });
            }}
          >
            Back
          </button>
          <div>
            <table border={1} style={{ width: "750px" }}>
              <thead>
                <tr>
                  <td>Doc No</td>
                  <td>Doc Date</td>
                  <td>Doc Status</td>
                  <td>Vendor</td>
                  <td>Edit</td>
                </tr>
              </thead>
              <tbody>
                {Grn.map((ele, index) => {
                  let venName = "";
                  CustomerList.map((cus) => {
                    if (cus.id == ele.Vendor) {
                      venName = cus.customer_name;
                    }
                  });
                  return (
                    <tr key={index}>
                      <td>{ele.DocNo}</td>
                      <td>{ele.DocDate}</td>
                      <td>{ele.DocStatus}</td>
                      <td>{venName}</td>
                      <td>
                        <button
                          onClick={() => {
                            handleEdit(ele.GRN_id);
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
     
    </>
  );
}
