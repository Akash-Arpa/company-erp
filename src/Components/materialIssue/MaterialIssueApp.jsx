import { BrowserRouter, Routes, Route } from "react-router-dom";
import MaterialIssue from './MaterialIssue'
import MaterialIssueDash from "./materialIssueDash";
 
function MaterialIssueApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<MaterialIssue />} />
        <Route path="/material-issue-dash" element={<MaterialIssueDash />} />
      </Routes>
    </BrowserRouter>
  );
}
 
export default MaterialIssueApp;
