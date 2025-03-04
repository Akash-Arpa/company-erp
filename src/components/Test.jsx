import React from 'react'
import { useStock } from '../hooks/useStockService'

const insertTest1 = [
    {
        "docNo": "GRN0001",
        "docNoYearly": "GRN0001Y",
        "docDate": "23-01-2025",
        "poNo": "PO0001",
        "item_id": "MM0001",
        "qty": 32,
        "formCode": "IGRN"
    },
    {
        "docNo": "GRN0001",
        "docNoYearly": "GRN0001Y",
        "docDate": "23-01-2025",
        "poNo": "PO0001",
        "item_id": "MM0002",
        "qty": 15,
        "formCode": "IGRN"
    },
    {
        "docNo": "GRN0001",
        "docNoYearly": "GRN0001Y",
        "docDate": "23-01-2025",
        "poNo": "PO0002",
        "item_id": "MM0001",
        "qty": 50,
        "formCode": "IGRN"
    },
    {
        "docNo": "GRN0001",
        "docNoYearly": "GRN0001Y",
        "docDate": "23-01-2025",
        "poNo": "PO0002",
        "item_id": "MM0004",
        "qty": 22,
        "formCode": "IGRN"
    },
    {
        "docNo": "GRN0001",
        "docNoYearly": "GRN0001Y",
        "docDate": "23-01-2025",
        "poNo": "PO0003",
        "item_id": "MM0005",
        "qty": 10,
        "formCode": "IGRN"
    }
]



const issueTest1 = [
    {
        "docNo": "MI0001",
        "docNoYearly": "MI0001Y",
        "docDate": "24-01-2025",
        "poNo": "PO0001",
        "item_id": "MM0001",
        "qty": 5,
        "formCode": "IMI"
    },
    {
        "docNo": "MI0001",
        "docNoYearly": "MI0001Y",
        "docDate": "24-01-2025",
        "poNo": "PO0001",
        "item_id": "MM0002",
        "qty": 3,
        "formCode": "IMI"
    },
    {
        "docNo": "MI0001",
        "docNoYearly": "MI0001Y",
        "docDate": "24-01-2025",
        "poNo": "PO0003",
        "item_id": "MM0005",
        "qty": 3,
        "formCode": "IMI"
    }
]


export const Test = () => {

    const [error, setInsert, setUpdate, setDelete] = useStock()
    console.log(typeof(setInsert));
    
    const handleInsert = () =>{
        setInsert([...insertTest1])
    }
    const handleIssue = () =>{
        setUpdate(issueTest1)
    }
    const handleDelete = () =>{
        setDelete("IGRN", "GRN0001")
    }

    return (
        <>
            <button onClick={handleInsert}>Insert</button>
            <button onClick={handleIssue}>Issue</button>
            <button onClick={handleDelete}>Delete</button>
            <div>{error}</div>
        </>
    )
}
