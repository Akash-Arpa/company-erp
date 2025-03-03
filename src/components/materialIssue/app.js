import MaterialIssue from './Components/MaterialIssue';
import MaterialIssueDash from './Components/materialIssueDash';
import { BrowserRouter, Routes, Route } from "react-router-dom";
 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<MaterialIssue />} />
        <Route path="/material-issue-dash" element={<MaterialIssueDash />} />
      </Routes>
    </BrowserRouter>
  );
}
 
export default App;
