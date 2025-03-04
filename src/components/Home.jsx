import React, { useState } from "react";
import PoMain from "../components/purchaseOrder/PoMain";
import PO from "./purchaseOrder/PO";
import GRN from "./grn/GRN";
import Report, { stockLoader } from "./report/Report";
import { useNavigate } from "react-router-dom";
import MaterialIssueApp from "./materialIssue/MaterialIssueApp";
import { Link, Outlet} from "react-router-dom";

export default function Home() {
  return (
    <div>      
      <button>
        <Link to="/report">Report</Link>
      </button> 
      <Outlet/>
    </div>
  );
}
