export const stockApi = {
    async fetchStockDetails() {
        let response = await fetch('https://67c6b91b351c081993fe715a.mockapi.io/stockDetails');
        // console.log(response);
        let data = await response.json();
        return data;
    },
    async fetchStockSummary(){
        let response = await fetch('https://67c6b91b351c081993fe715a.mockapi.io/stockSummary');
        let data = await response.json();
        return data;
    },
    async addStockDetails(){

    },
    async addStockSummary(){

    },
    async updateStockDetail(){

    },
    async updateStockSummary(){

    }
}
