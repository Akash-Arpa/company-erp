import React, { useEffect, useState } from "react";

const ScheduleModal = ({
  item,
  formData,
  onScheduleAdd,
  setSOpen,
  sDialogRef,
}) => {
  const getRemainingQty = (schedule) => {
    const sQty = schedule.reduce(
      (acc, el) => (acc += Number(el.schedule_qty)),
      0
    );
    console.log(item.qty, sQty);
    return Math.max(0, item.qty - sQty);
  };

  const initialState = {
    schedule_id: +new Date(),
    schedule_date: "",
    schedule_qty: "",
    itemDetail_id: item?.itemDetail_id || 0,
  };
  const [schedule, setSchedule] = useState([
    ...formData.scheduleDetails.filter(
      (el) => el.itemDetail_id === item?.itemDetail_id
    ),
    { ...initialState },
  ]);

  useEffect(() => {
    if (schedule[schedule.length - 1].schedule_qty === "") {
      console.log("Inside If , Out of Schedule");

      setSchedule((prev) => {
        console.log("Inside Set Schedule");
        const updatedList = [...schedule];
        if (updatedList[schedule.length - 1].schedule_qty === "")
          updatedList[schedule.length - 1].schedule_qty = getRemainingQty(prev);
        return updatedList;
      });
    }
  }, []);

  const handleChange = (e, id) => {
    console.log(e.target.value);
    const currItem = schedule.find((el) => el.schedule_id === id);
    const currIndex = schedule.findIndex((el) => el.schedule_id === id);
    if (e.target.name === "schedule_date" && currIndex == schedule.length - 1) {
      currItem[e.target.name] = e.target.value;

      setSchedule((prev) => {
        let updatedList = [...prev];
        if (currItem.schedule_qty === 0) {
          currItem.schedule_qty = getRemainingQty(prev);
          initialState.schedule_qty = getRemainingQty(prev);
        } else {
          initialState.schedule_qty = getRemainingQty(prev);
        }
        updatedList.splice(currIndex, 1, currItem);
        // console.log(updatedList, initialState);
        return [...updatedList, { ...initialState }];
      });
      return;
    }
    currItem[e.target.name] = e.target.value;
    setSchedule((prev) => {
      let updatedList = [...prev];
      updatedList.splice(currIndex, 1, currItem);
      return updatedList;
    });
  };

  const handleSubmit = () => {
    const data = schedule.filter(
      (el) => el.schedule_date != "" && el.schedule_qty != 0
    );
    const totalQty = data.reduce(
      (acc, el) => (acc += Number(el.schedule_qty)),
      0
    );
    console.log("total", totalQty);
    if (totalQty != item.qty) {
      alert("Your Schedule Quantity is mismatching!!!");
      return;
    }
    onScheduleAdd(data, item.itemDetail_id);
    setSOpen(false);
    sDialogRef.current.close();
  };

  return (
    <>
      <table border={1} className="item-grid">
        <thead>
          <tr>
            <td>Sno.</td>
            <td>Schedule Date</td>
            <td>Qty.</td>
          </tr>
        </thead>
        <tbody>
          {schedule.map((item, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <input
                    type="date"
                    step={0.001}
                    min={new Date().toISOString().split("T")[0]}
                    name="schedule_date"
                    value={item.schedule_date}
                    onChange={(e) => handleChange(e, item.schedule_id)}
                  />
                </td>
                <td className="text-right">
                  <input
                    type="number"
                    name="schedule_qty"
                    value={item.schedule_qty}
                    onChange={(e) => handleChange(e, item.schedule_id)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button className="mt-1" type="button" onClick={handleSubmit}>
        Add Schedule
      </button>
    </>
  );
};

export default ScheduleModal;
