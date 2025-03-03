import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLot } from '../../hooks/useLot';
import { useStock } from '../../hooks/useStockService'; 

function MaterialIssue() {
    const [ error,setInsert, setUpdate, setDelete] = useStock();
    const [ItemData, setItemData] = useState([]);
    const [updateAll, setUpdateAll] = useState(false);
    const [enableModal, setModal] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [localData, setLocalData] = useState([]);
    const [edited, setEdited] = useState(false); 
    const [AuthorizedState, setAuthourizedState] = useState(false); 
 
    const { getLot } = useLot();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [notEditing, setNotEditing] = useState(false);
 
    useEffect(() => {
        fetch("https://dummyjson.com/c/6e58-6906-42c4-9164")
            .then(response => response.json())
            .then(data => setItemData(data.result || []))
            .catch(error => console.error("Fetch error:", error));
        console.log(ItemData);
    }, [updateAll]);
 
    useEffect(() => {
        setLocalData(
            ItemData.map(item => ({
                selected: item.selected,
                item_id: item.id,
                item_name: item.item_name,
                item_quantity: "",
                lots: []
            }))
        );
        console.log(localData);
        //PopulateEdit();
    }, [ItemData]);
 
    useEffect(() => {
        const issueToEdit = sessionStorage.getItem('issueToEdit');
        console.log(issueToEdit);
        if (issueToEdit) {

            const materialIssues = JSON.parse(localStorage.getItem('MaterialIssue')) || [];
            const issue = materialIssues.find(issue => issue.docNo == issueToEdit);
            if(edited){
                return;
            }
            else{
                if (issue) {
                    document.getElementById("docNo").value = issue.docNo;
                    document.getElementById("docDate").value = issue.docDate;
                    document.getElementById("issuedTo").value = issue.issuedTo;
                    document.getElementById("docStatus").value = issue.docStatus;
                    document.getElementById("docNo").disabled = true;
                    if(issue.docStatus == "Authourized") setAuthourizedState(true);
                    localData.map(item => {
                        const existingItem = issue.issuedMaterial.find(issuedItem => issuedItem.item_id == item.item_id);
                        console.log(existingItem);
                        if (existingItem) {
                            setEdited(true);
                            item.selected = true;
                            item.item_quantity = existingItem.item_quantity;
                            item.lots = existingItem.lots;
                            console.log(localData);
                            setEditing((prev) => true);
                            console.log("Editing", editing);
                        }
                    });
                }
            }
           
 
        }
    })
 
    function PopulateEdit() {
        const issueToEdit = sessionStorage.getItem('issueToEdit');
        console.log(issueToEdit);
        if (issueToEdit) {
            const materialIssues = JSON.parse(localStorage.getItem('MaterialIssue')) || [];
            const issue = materialIssues.find(issue => issue.docNo == issueToEdit);
            if (issue) {
                document.getElementById("docNo").value = issue.docNo;
                document.getElementById("docDate").value = issue.docDate;
                document.getElementById("issuedTo").value = issue.issuedTo;
                document.getElementById("docStatus").value = issue.docStatus;
                document.getElementById("docNo").disabled = true;
                localData.map(item => {
                    const existingItem = issue.issuedMaterial.find(issuedItem => issuedItem.item_id == item.item_id);
                    console.log(existingItem);
                    if (existingItem) {
                        item.selected = true;
                        item.item_quantity = existingItem.item_quantity;
                        item.lots = existingItem.lots;
                        console.log(localData);
                        setEditing(pre => true);
                        console.log("Editing", editing);
                    }
                });
            }
 
        } else {
            setNotEditing(true);
            console.log("Not Editing", notEditing);
        }
    }
 
    const closeModal = () => {
        setModal(false);
        setModalData([]);
    };
 
    const refreshModalData = () => {
        let id = modalData[0].item_id;
        let date = document.getElementById("docDate").value;
        let newData = getLot(id, date);
        console.log("New Data", newData);
        console.log("Modal Data", modalData);
        newData.map((item) => {
            let data = modalData.find(data => data.stock_id == item.stock_id);
            if (data) {
                console.log(data);
                item.issueQty = data.issueQty;
            }
        })
        setModalData(newData);
    };
 
    const toggleSelectLot = (index) => {
        setModalData((prevData) =>
            prevData.map((item, i) =>
                i == index ? { ...item, selected: !item.selected } : item
            )
        );
    };
 
    const saveItemData = () => {
        setLocalData((prevData) => {
            let updatedData = [...prevData];
 
            // Find the existing item
            let existingItem = updatedData.find(item => item.item_id == modalData[0].item_id);
            let currQuantity = modalData.reduce((accumulator, item) => {
                if (item.selected) {
                    accumulator += parseFloat(item.issueQty);
                }
                return accumulator;
            }, 0);
 
            console.log(existingItem);
            console.log(currQuantity);
            if ((Number(currQuantity)) != Number(existingItem.item_quantity)) {
                alert("Quantity not equivalent to the defined quantity");
                return prevData;
            }
 
            // Clear previous lots if an item exists
            if (existingItem) {
                existingItem.lots = [];
            }
 
            // Update the lots for selected items
            modalData.forEach((item) => {
                if (item.selected) {
                    let existingItem = updatedData.find(data => data.item_id == item.item_id);
 
                    if (existingItem) {
                        existingItem.lots.push({
                            selected: true,
                            stock_id: item.stock_id,
                            docNo: item.docNo,
                            docDate: item.docDate,
                            stockQty: item.stockQty,
                            balance: item.balance,
                            issueQty: item.issueQty || 0,
                        });
                    } else {
                        updatedData.push({
                            item_id: item.item_id,
                            lots: [
                                {
                                    stock_id: item.stock_id,
                                    docNo: item.docNo,
                                    docDate: item.docDate,
                                    stockQty: item.stockQty,
                                    balance: item.balance,
                                    issueQty: item.issueQty || 0,
                                },
                            ],
                        });
                    }
                }
            });
 
            closeModal();
            return updatedData; // Return the updated state
        });
    };
 
    const updateQuantity = (id, quantity) => {
        setLocalData((prevData) =>
            prevData.map((item) =>
                item.item_id == id ? { ...item, item_quantity: quantity } : item
            )
        );
    };
 
    const populateItem = (id) => {
        console.log(id);
        let date = document.getElementById("docDate").value;
        if (!date) {
            alert("Please choose a valid date to continue");
            return;
        }
        console.log(id, date);
        let data = getLot(id, date);
        console.log("Data", data);
        setModal(true);
        setModalData(data);
 
        let existingItem = localData.find(item => item.item_id == id);
        console.log(existingItem);
        if (existingItem) {
            existingItem.lots.forEach(item => {
                let currData = data.find(data => data.stock_id == item.stock_id);
                console.log("Curr", currData);
                if (currData) {
                    currData.issueQty = item.issueQty;
                    currData.selected = item.selected;
                }
            });
        }
        console.log(modalData);
    };
 
    const itemMarked = (id, status) => {
        let item = localData.find(item => item.item_id == id);
        item.selected = status.checked;
        if (status.checked) {
            document.getElementById(`quant${item.item_id}`).disabled = false;
        }
        else {
            document.getElementById(`quant${item.item_id}`).disabled = true;
            document.getElementById(`quant${item.item_id}`).value = "";
            if (item.lots.length > 0) alert("Issue quantity of this item if present will be cleared");
            item.lots = [];
            item.item_quantity = "";
        }
    }
 
    // Delete operation
 
    const deleteMaterialIssue = () => {
        let docNo = document.getElementById("docNo").value;
        if (docNo == "") {
            alert("Lack of data to delete");
            return;    
        }
        if(AuthorizedState){
            alert("Cannot delete authourized material issue");
            return;
        }
        else{
            let MaterialIssue = JSON.parse(localStorage.getItem("MaterialIssue")) || [];
            let data = MaterialIssue.find(issue => issue.docNo == docNo);
            if (data) {
                let index = MaterialIssue.indexOf(data);
                MaterialIssue.splice(index, 1);
                localStorage.setItem("MaterialIssue", JSON.stringify(MaterialIssue));
                alert("Material Issue deleted successfully");
                resetForm();
            }
            else{
                alert("Material Issue not found");
                return;
            }
        }
    }
    // Save operation
 
    const saveMaterialIssue = () => {
        console.log(localData);
        let itemDataToBeStored = localData.filter(item => item.selected == true);
        if (itemDataToBeStored.length == 0) {
            alert("Please select an item to continue");
            return;
        }
        else {
            let valid = itemDataToBeStored.every(item => item.item_quantity != "");
            if (!valid) {
                alert("Please enter quantity for all selected items");
                return;
            }
            else {
                let valid = itemDataToBeStored.every(item => item.lots.length > 0);
                if (!valid) {
                    alert("Please select a lot for all selected items");
                    return;
                }
                else {
                    let quantity = null;
                    let total = null;
                    itemDataToBeStored.map(item => {
                        quantity = item.item_quantity;
                        total = item.lots.reduce((accumulator, item) => {
                            accumulator += parseFloat(item.issueQty);
                            return accumulator;
                        }, 0);
                        console.log("Quantity", quantity);
                        console.log("Total", total);
                    });
                    if (Number(quantity) != Number(total)) {
                        alert("There is a disparity between the quantity entered and the total quantity issued");
                        return;
                    }
                    else{
                        let MaterialIssue = JSON.parse(localStorage.getItem("MaterialIssue")) || [];
                    let data = {
                        docNo: document.getElementById("docNo").value,
                        docDate: document.getElementById("docDate").value,
                        issuedTo: document.getElementById("issuedTo").value,
                        docStatus: document.getElementById("docStatus").value,
                        issuedMaterial: itemDataToBeStored,
                    }
                    if (data.docNo == "" || data.docDate == "" || data.issuedTo == "" || data.docStatus == "") {
                        alert("Please fill all the fields to continue");
                        return;
                    }
 
                    // Check if editing an existing issue
                    const issueToEdit = sessionStorage.getItem('issueToEdit');
                    if (issueToEdit) {
                        const index = MaterialIssue.findIndex(issue => issue.docNo == issueToEdit);
                        if (index !== -1) {
                            MaterialIssue[index] = data;
                        }

                        if(AuthorizedState){
                            alert("Any edit was not permited therefore the Material Issue stays as it is");
                            setAuthourizedState(false);
                            resetForm();
                            return;
                        }
                        else{
                            if(data.docStatus == "Authourized") {
                                let dataToSend = [];
                                data.issuedMaterial.map((item) =>{
                                    item.lots.map((material) =>{
                                        let datatoStore = {
                                            formCode: "IMI",
                                            item_id: item.item_id,
                                            docNo: data.docNo,
                                            docNoYearly: `${data.docNo}Y`,
                                            docDate: data.docDate,
                                            qty: Number(material.issueQty),
                                            stock_id: material.stock_id
                                        }
                                        console.log(datatoStore);
                                        dataToSend.push(datatoStore);
                                    })
                                })
                                setUpdate(dataToSend);
                            }
                        }
                    } else {
                        if(data.docStatus == "Authourized") {
                            let dataToSend = [];
                            data.issuedMaterial.map((item) =>{
                                item.lots.map((material) =>{
                                    let datatoStore = {
                                        formCode: "IMI",
                                        item_id: item.item_id,
                                        docNo: data.docNo,
                                        docNoYearly: `${data.docNo}Y`,
                                        docDate: data.docDate,
                                        qty: Number(material.issueQty),
                                        stock_id: material.stock_id
                                    }
                                    console.log(datatoStore);
                                    dataToSend.push(datatoStore);
                                })
                            })
                            setUpdate(dataToSend);
                        }
                        MaterialIssue.push(data);
                    }
 
                    localStorage.setItem("MaterialIssue", JSON.stringify(MaterialIssue));
                    alert("Material Issue saved successfully");
                    resetForm();
                }
                    }
            }
        }
    }
 
    // reset form data
    const resetForm = () => {
        document.getElementById("docNo").value = "";
        document.getElementById("docDate").value = "";
        document.getElementById("issuedTo").value = "";
        document.getElementById("docStatus").value = "";
        setLocalData([]);
        setUpdateAll(!updateAll);
        setModal(false);
        setModalData([]);
        sessionStorage.removeItem('issueToEdit');
        setAuthourizedState(false);
        navigate('/');
    }
 
    const handleOpenDashboard = () => {
        navigate('/material-issue-dash');
    }
 
    return (
        <>
            <table>
                <tbody>
                    <tr>
                        <td>Doc No.</td>
                        <td><input id='docNo' type="text" readOnly={AuthorizedState} /></td>
                    </tr>
                    <tr>
                        <td>Doc Date</td>
                        <td><input type="date" id="docDate" readOnly={AuthorizedState} /></td>
                    </tr>
                    <tr>
                        <td>Issue To</td>
                        <td><input type="text" id='issuedTo' readOnly={AuthorizedState} /></td>
                    </tr>
                    <tr>
                        <td>Document Status</td>
                        <td>
                            <select id='docStatus' disabled={AuthorizedState}>
                                <option value="Initial">Initial</option>
                                <option value="Authourized">Authorized</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td><button onClick={() => saveMaterialIssue()}>Save</button></td>
                        <td><button onClick={() => deleteMaterialIssue()}>Delete</button></td>
                        <td><button onClick={handleOpenDashboard}>Open</button></td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                                <>
                                    <table>
                                        <caption>Available Items</caption>
                                        <thead>
                                            <tr>
                                                <th>Select</th>
                                                <th>Item</th>
                                                <th>Quantity</th>
                                                <th>Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {localData.map((item) => (
 
                                                <tr key={item.item_id}>
                                                    <td><input type="checkbox" disabled={AuthorizedState} onInput={(e) => itemMarked(item.item_id, e.target)} checked={item.selected} /></td>
                                                    <td>{item.item_name}</td>
                                                    <td><input id={`quant${item.item_id}`} type="number" readOnly={AuthorizedState} disabled={!item.selected} value={item.item_quantity} onInput={(e) => updateQuantity(item.item_id, e.target.value)} /></td>
                                                    <td><button onClick={() => populateItem(item.item_id)}>Populate</button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                        </td>
                    </tr>
                </tbody>
            </table>
 
            {/* Modal Wrapper */}
            {enableModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Stock Details</h3>
                        <button onClick={closeModal}>Close</button>
                        <button onClick={saveItemData}>Save</button>
                        <button onClick={refreshModalData}>Refresh</button>
                        <table>
                            <thead>
                                <tr>
                                    <th>Select</th>
                                    <th>Stock No.</th>
                                    <th>Doc No. Yearly</th>
                                    <th>Doc Date</th>
                                    <th>Stock Quantity</th>
                                    <th>Balance Quantity</th>
                                    <th>Issue Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {modalData.map((lot, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                disabled={AuthorizedState}
                                                type="checkbox"
                                                checked={lot.selected}
                                                onChange={() => toggleSelectLot(index)}
                                            />
                                        </td>
                                        <td>{lot.stock_id}</td>
                                        <td>{lot.docNo}</td>
                                        <td>{lot.docDate}</td>
                                        <td>{lot.stockQty}</td>
                                        <td>{lot.balance}</td>
                                        <td>
                                            <input
                                                readOnly={AuthorizedState}
                                                type="number"
                                                value={lot.issueQty}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setModalData((prevData) =>
                                                        prevData.map((item, i) =>
                                                            i === index ? { ...item, issueQty: value } : item
                                                        )
                                                    );
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}
 
export default MaterialIssue;
 
 
