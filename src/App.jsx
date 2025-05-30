import './App.css'
import Home from './components/Home'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PoMain from './components/purchaseOrder/PoMain';
import SearchPo from './components/purchaseOrder/SearchPo';
import GRN from './components/grn/GRN';
import Report from './components/report/Report'; 
import MaterialIssue from './Components/materialIssue/MaterialIssue'; 

function App() {
  
  return (
    <>
    {/* <Home/> */}
     <Router>
      <Routes>
        {/* <Route path="/" element={ <Home/>} /> */}
        <Route path="/" element={ <PoMain/>} />
        <Route path="po-search" element={<SearchPo />} />
        <Route path="/grn" element={<GRN />} />
        <Route path="/report" element={<Report />} />
        <Route path="/material-issue" element={<MaterialIssue />} />
      </Routes>
    </Router>
    
    </>
  )
}

export default App

