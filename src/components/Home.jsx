import React, { useState } from "react";
import PoMain from "../components/purchaseOrder/PoMain";
import PO from "./purchaseOrder/PO";
import GRN from "./grn/GRN";
import Report from "./report/Report";
import { useNavigate } from "react-router-dom";
import MaterialIssueApp from "./materialIssue/MaterialIssueApp";

export default function Home() {
//   const navigate = useNavigate();

  const tab = [
    {
      tab: PO,
      Name: "PurchaseOrder",
      title: "po-main",
    },
    {
      tab: GRN,
      Name: "GRN",
      title: "grn",
    },
    {
      tab: Report,
      Name: "Report",
      title: "report",
    },
    {
      tab: MaterialIssueApp,
      Name: "Material Issue",
      title: "material-issue",
    },
  ];

  const handleActiveTab = (title) => {
    setActiveIndex((prev) => {
      return title;
    });
    //navigate(title);
  };

  const [activeIndex, setActiveIndex] = useState(1);
  let ActiveTab = tab[activeIndex].tab;

  return (
    <>

      <div style={{marginBottom:"20px"}}>
        {tab.map((ele, index) => {
          return (
            <button
              key={index}
              onClick={() => {
                // handleActiveTab(ele.title);
                handleActiveTab(index);
              }}
              style={{ margin: "5px" }}
            >
              {ele.Name}
            </button>
          );
        })}
      </div>
      <hr style={{marginBottom:"20px", width:"100%"}}/>
      <div>
        <ActiveTab />
      </div>
    </>
  );
}
