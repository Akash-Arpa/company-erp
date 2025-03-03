export default function useDateFilter(){
    const filterByDate = (date, fromDate, toDate) => {
        if (!fromDate || !toDate) return true;
        const targetDate = new Date(date);
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);

        return date >= fromDate && date <= toDate;
    };
    return {filterByDate};
};
