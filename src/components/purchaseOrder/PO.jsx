import React from 'react'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PoMain from './PoMain';
import SearchPo from './SearchPo';
export default function PO() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <PoMain/>} />
        <Route path="/po-search" element={<SearchPo />} />
      </Routes>
    </Router>
  )
}
