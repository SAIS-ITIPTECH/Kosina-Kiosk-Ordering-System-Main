class OrderDetailButtons{
    constructor(button){
        this.element = button;
        this.container;
        this.orderDetails = new OrderDetails
    }

    setContainer(){
        this.container = this.element.parentElement
        console.log('worked')
    }

    giveListenerOrder(method){
        this.element.onclick = method;
    }
}

//give eventlisnter and functioon for the change quantity
class ChangeQuantity extends OrderDetailButtons{
    constructor(button) {
        super(button);
    }

    //call the oupdateQuantity method from orderDetails object/class
    async changeQuantity(){
        //has await so the program would pause until the user is finished chainging the order
        await orderList.updateQuantity(this.element.parentElement.id);
        this.orderDetails.display();
    }
    
    create(){
        this.giveListenerOrder(() => this.changeQuantity());
    }
}

//remove the selected order
class RemoveOrder extends OrderDetailButtons{
    constructor(button) {
        super(button);
    }

    //remove the selected order
    selectOrder(){
        orderList.removeOrder(this.element.parentElement.id);
        this.orderDetails.display();
    }
    
    create(){
        this.giveListenerOrder(() => this.selectOrder());
    }
}

export { Categories, Products, OrderDetails };
