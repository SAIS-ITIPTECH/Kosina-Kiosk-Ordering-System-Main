import { DomContainer } from "./DomContainer.js";
import { Products } from "./Products.js";

export class DomCategory extends DomContainer {
    constructor(object) {
        super(object['name'], object['category_id']);
        this.index = object['display_index'];
        this.value = object.category_id
        this.productDisplay = new Products();
        this.title = document.getElementById("categoryTitle");
        this.element
    }

    render(parent) {
        let categoryName = document.createElement('button');
        categoryName.innerHTML = `
            <div class="mb-2 h-8 w-8 border-2 border-dashed border-gray-300 rounded"></div>
            <span class="categoryName text-[10px] text-black font-bold uppercase ">${this.name}</span>
        `;
        categoryName.value = this.index;
        categoryName.className = "category flex h-24 w-24 flex-col items-center justify-center rounded-xl border bg-white shadow-sm transition-all duration-200 hover:bg-[#d8e0c6] hover:shadow-xl hover:scale-105";
        categoryName.id = this.value
        categoryName.onclick = this.displayProduct;
        parent.appendChild(categoryName);
        this.element = categoryName;
    }
}

