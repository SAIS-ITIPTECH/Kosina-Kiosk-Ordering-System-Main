export class OrderList {
    constructor() {
        this.products = [];
        this.totalPrice = 0;
        this.diningMethod;
        this.orderId;
    }

    //add order used by the Products Class
    addOrder(order) {
        this.products.push(order);
        this.calculateTotalPrice();
    }

    //Used by dining method button
    setDiningMethod(diningMethod){
        this.diningMethod = diningMethod;
    }

    // used by payment method button
    setPaymentMethod(paymentMethod){
        this.paymentMethod = paymentMethod;
    }
    
    //called everytime a new order added ti the orderList
    calculateTotalPrice(){  
        let totalPrice = 0;
        this.products.forEach((pro)=>{
            totalPrice += pro.getTotalPrice();
        });
        this.totalPrice = totalPrice;

    }

    resetOrder(){
        this.products = [];
        this.totalPrice = 0;
        this.diningMethod = null;
    }
}
