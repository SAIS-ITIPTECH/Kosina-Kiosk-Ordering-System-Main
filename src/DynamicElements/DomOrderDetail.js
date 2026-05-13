import { DomContainer } from "./DomContainer.js";

export class DomOrderDetail extends DomContainer {
    constructor(order) {
        super(order.getName(), order.getId());
        this.price = order.getPrice();
        this.quantity = order.getQuantity();
        this.imgUrl = order.getImgUrl();
    }

    // HTML builder for the order details
    render(container) {
        container.innerHTML += `
        <div class="flex gap-3 border-b pb-4 animate-item-add">
            <!-- Image -->
            <img src="${this.imgUrl}" class="h-14 w-14 flex-shrink-0 rounded object-cover border border-gray-200">
            
            <!-- Content -->
            <div class="flex flex-col flex-1 min-w-0 gap-1.5">
                <!-- Name + Delete Row -->
                <div class="flex items-start justify-between gap-2">
                    <p class="text-sm font-bold uppercase leading-tight">${this.name}</p>
                    
                </div>

                <!-- Price + Qty Controls Row -->
                <div class="flex items-center justify-between">
                
                    <p id="price${this.id}" class="text-xs text-[#76a609] font-bold">
                        ${this.price.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                    </p>

                    <div class="flex items-center gap-2">
                    
                        <button onclick="changeQty('${this.id}', -1)" class="h-6 w-6 rounded bg-gray-100 text-xs font-bold hover:bg-gray-200">-</button>
                        <span id="order${this.id}" class="text-sm font-bold w-5 text-center">${this.quantity}</span>
                        <button onclick="changeQty('${this.id}', 1)" class="h-6 w-6 rounded bg-[#d8e0c6] text-[#76a609] text-xs font-bold hover:bg-[#c8d4b0]">+</button>

                        <button onclick="removeItem('${this.id}')" class="flex-shrink-0 text-red-400 hover:text-red-600 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    }
}