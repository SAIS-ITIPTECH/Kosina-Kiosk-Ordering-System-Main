import { getApi, orderList, openPopup, closePopup } from "../script.js";
import { DomList } from "./DomList.js";
import { DomProduct } from "./DomProduct.js";
import { Order } from "../Models/Order.js";
import { OrderList } from "../Models/OrderList.js";
import { OrderDetails } from "./OrderDetails.js";


export class Products extends DomList {
    constructor() {
        super("productList");
        this.orderDetails = new OrderDetails();
        this.cache = new Map();
    }
    
    async display(categoryId) {
        if (this.isLoading) return;
        this.isLoading = true;
        this.clear();

        let products;
        if (this.cache.has(categoryId)) {
            products = this.cache.get(categoryId);
        } else {
            products = await getApi("products", categoryId);
            this.cache.set(categoryId, products);
        }

        await this.putToItems(products);
        this.renderAll();
        this.isLoading = false;
    }

    async putToItems(products){
        this.items = await products.map(pro => {
            let item = new DomProduct(pro);

            //Called if a product is clicked
            item.addOrder = async () => { 
                const order = new Order(item.name, item.price, item.id, item.imgUrl);
                await this.finishOrder(order, item);
            };
            return item;   
        });
    }

    //opens the quantity panel when a product clicked
    async finishOrder(order, item){
        return new Promise((resolve) => {
            openPopup(item.imgUrl, item.name, item.price.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }));
            const quantityCount = document.getElementById("quantityCount")

            document.getElementById("addOrder").onclick = () => {
                order.setQuantity(quantityCount.innerText);
                this.checkIfRepeat(order)
                document.getElementById("totalPrice").innerText = orderList.totalPrice.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
                closePopup();
                resolve(this);
            }

            document.getElementById("closePopup").onclick = () => {
                closePopup();
                resolve(this);
            }
        })
    }

    // Checks if a product is already in the orderlist
    checkIfRepeat(order){
        const existingItem = orderList.products.find(item => item.getId() === order.getId());
        if (existingItem) {
            existingItem.setQuantity(parseInt(existingItem.getQuantity() + order.getQuantity()));
            document.getElementById(`order${existingItem.getId()}`).innerText = existingItem.getQuantity();
            orderList.calculateTotalPrice()
        } else {
            orderList.addOrder(order);
            document.getElementById('checkoutBtn').disabled = false;
            this.orderDetails.display()
        }
    }
}
