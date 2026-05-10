import { DomList } from "./DomList.js";
import { DomOrderDetail } from "./DomOrderDetail.js";
import { orderList } from "../script.js";

export class OrderDetails extends DomList {
    constructor(){
        super("orderPanel");
    }
    
    display() {
        this.clear();
        this.items = orderList.products.map(order => {
            return new DomOrderDetail(order)
        })
        this.renderAll(); 
        this.items = []
    }
}
 