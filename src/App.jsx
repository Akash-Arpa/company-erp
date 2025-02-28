import { useState } from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PoMain from "./components/purchaseOrder/PoMain";
import SearchPo from "./components/purchaseOrder/SearchPo";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PoMain />} />
        <Route path="po-search" element={<SearchPo />} />
      </Routes>
    </Router>
  );
}

export default App;
