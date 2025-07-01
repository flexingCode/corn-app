import api from ".";

interface PurchaseResponse {
    lastPurchase: string;
}

const buyCorn = async (email:string): Promise<PurchaseResponse> => {
    const response = await api.post("/purchase", {email});
    if (response.status === 429) {
        return {
            lastPurchase: response.data.lastPurchase
        }
    }
    return response.data;
}

const PurchaseService = {
    buyCorn
}

export default PurchaseService;