import React, { useState, useEffect } from 'react';
import { useLot } from '../hooks/useLot';


function MaterialIssue() {
    const [ItemData, setItemData] = useState([]);
    const [enableModal, setModal] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [localData, setLocalData] = useState([]);
    const {getLot} = useLot();

    useEffect(() => {
        fetch("https://dummyjson.com/c/6e58-6906-42c4-9164")
            .then(response => response.json())
            .then(data => setItemData(data.result || []))
            .catch(error => console.error("Fetch error:", error));
        console.log(ItemData);
    }, []); 
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
    }, [ItemData]); 
    



    const closeModal = () => {
        setModal(false);
        setModalData([]);
    };

    const refreshModalData = () => {
        let id = modalData[0].item_id;
        let date = document.getElementById("docDate").value;
        let newData = getLot(id,date);
        console.log("New Data",newData);
        console.log("Modal Data",modalData);
        newData.map((item)=>{
            let data = modalData.find(data => data.stock_id == item.stock_id);
            if(data){
                console.log(data);
                item.issueQty = data.issueQty;
            }
            
        })
        setModalData(newData);
    };

    const toggleSelectLot = (index) => {
        setModalData((prevData) =>
            prevData.map((item, i) =>
                i === index ? { ...item, selected: !item.selected } : item
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
                    accumulator += item.issueQty;
                }
                return accumulator;
            }, 0);
            
            
            console.log(existingItem);
            if (Number(currQuantity) != Number(existingItem.item_quantity)) {
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
                item.item_id === id ? { ...item, item_quantity: quantity } : item
            )
        );
    };


    const populateItem = (id) => {
        console.log(id);
        let date = document.getElementById("docDate").value;
        let data = getLot(id,date);
        console.log("Data",data);
        setModal(true);
        setModalData(data);

        let existingItem = localData.find(item => item.item_id == id);
        console.log(existingItem);
        if (existingItem) {
            existingItem.lots.forEach(item => {
                let currData = data.find(data => data.stock_id == item.stock_id);
                console.log("Curr", currData);
                if (currData){
                    currData.issueQty = item.issueQty;
                    currData.selected = item.selected;
                } 
            });
        }

        console.log(modalData);
    };

    // Save operation 

    const saveMaterialIssue = () =>{

    }
    return (
        <>
            <table>
                <tbody>
                    <tr>
                        <td>Doc No.</td>
                        <td><input type="text" /></td>
                    </tr>
                    <tr>
                        <td>Doc Date</td>
                        <td><input type="date" id="docDate" /></td>
                    </tr>
                    <tr>
                        <td>Issue To</td>
                        <td><input type="text" /></td>
                    </tr>
                    <tr>
                        <td>Document Status</td>
                        <td>
                            <select>
                                <option value="I">Initial</option>
                                <option value="U">Authorized</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td><button onClick={saveMaterialIssue()}>Save</button></td>
                        <td><button>Delete</button></td>
                        <td><button>Open</button></td>
                    </tr>
                    <tr>
                        <td colSpan="2">
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
                                            <td><input type="checkbox" /></td>
                                            <td>{item.item_name}</td>
                                            <td><input type="number" onInput={(e) => updateQuantity(item.item_id, e.target.value)} /></td>
                                            <td><button onClick={() => populateItem(item.item_id)}>Populate</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
