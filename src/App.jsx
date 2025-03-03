import { useState } from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PoMain from "./components/purchaseOrder/PoMain";
import SearchPo from "./components/purchaseOrder/SearchPo";
import Report from "./components/report/Report";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PoMain />} />
        <Route path="po-search" element={<SearchPo />} />
        <Route path="report" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;
