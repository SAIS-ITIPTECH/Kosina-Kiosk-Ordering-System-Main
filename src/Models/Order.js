export class Order {
    #name
    #id
    #price
    #quantity
    #totalPrice
    #imgUrl

    constructor(name, price, id, imgUrl) {
        this.#name = name;
        this.#id = parseInt(id);
        this.#price = price;
        this.#imgUrl = imgUrl;
    }

    setName(name) {
        this.#name = name;
    }

    setId(id) {
        this.#id = id;
    }

    setPrice(price) {
        this.#price = price;
    }

    setUrl(url) {
        this.#imgUrl = url;
    }

    setQuantity(quantity) {
        this.#quantity = quantity;
        this.setTotalPrice();
    }

    setTotalPrice(){
        this.#totalPrice = this.#price * this.#quantity
    }

    getImgUrl(){
        return this.#imgUrl;
    }

    getName(){
        return this.#name;
    }

    getId(){
        return this.#id;
    }

    getPrice(){
        return Number(this.#price);
    }

    getQuantity(){
        return Number(this.#quantity);
    }

    getTotalPrice(){
        return this.#totalPrice;
    }
}