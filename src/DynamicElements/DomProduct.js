import { DomContainer } from "./DomContainer.js";


export class DomProduct extends DomContainer {
    constructor(product) {
        super(product['name'], product['product_id']);
        this.price = product['price'];
        this.imgUrl = product['display_url'];
    }

    render(parent) {
        let productCard = document.createElement('button');
        productCard.innerHTML = `
            <img src="${this.imgUrl}"
            class="mb-4 aspect-square w-full max-w-40 border-2 border-dashed border-gray-300 rounded-full transition-colors group-hover:border-[#76a609]"
            alt="Food 1">
            <h3 class="text-xs font-bold uppercase text-gray-600">${this.name}</h3>
            <p class="font-bold text-[#76a609]">${this.price.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</p>
        `;
                             
        productCard.onclick = () => this.addOrder();
        productCard.className = "productClass group flex flex-col items-center p-4 transition-all active:scale-95"
        parent.appendChild(productCard);
    }
}
