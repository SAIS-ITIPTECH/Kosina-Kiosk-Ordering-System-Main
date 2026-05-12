import { DomContainer } from "./DomContainer.js";


export class DomProduct extends DomContainer {
    constructor(product) {
        super(product['name'], product['product_id']);
        this.price = product['price'];
        this.imgUrl = product['display_url'];
    }

    render(parent) {
        let productCard = document.createElement('div');
        productCard.className = "bg-white border-[1.5px] border-[#d8e0c6] rounded-[2rem] p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-all";

        productCard.innerHTML = `
        <div class="mb-4 aspect-square w-40 h-40 overflow-hidden rounded-full border-4 border-white shadow-inner">
            <img src="${this.imgUrl}" class="w-full h-full object-cover" alt="${this.name}">
        </div>

        <div class="text-center mb-4 flex-1">
            <h3 class="text-sm font-black uppercase text-gray-700 tracking-tight leading-tight mb-2 px-2">${this.name}</h3>
            <p class="text-xl font-bold text-[#76a609]">${this.price.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</p>
        </div>

        <button class="add-btn w-full bg-[#76a609] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <span class="text-xl">+</span> Add to Order
        </button>
    `;

        productCard.querySelector('.add-btn').onclick = () => this.addOrder();

        parent.appendChild(productCard);
    }
}
