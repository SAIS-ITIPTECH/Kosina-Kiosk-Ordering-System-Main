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

        // Using a flex-shrink-0 to ensure buttons don't squash when the list gets long
        categoryName.className = `
        category flex-shrink-0 flex h-32 w-32 flex-col items-center justify-center 
        rounded-2xl bg-white shadow-md transition-all duration-300 
        hover:bg-[#84a91c] hover:text-white hover:shadow-xl hover:-translate-y-1
    `.trim();

        categoryName.innerHTML = `
        <div class="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 border-2 border-dashed border-gray-300 group-hover:border-white">
            </div>
        <span class="categoryName text-xs font-bold uppercase tracking-wider text-inherit">
            ${this.name}
        </span>
    `;

        categoryName.value = this.index;
        categoryName.id = this.value;
        categoryName.onclick = this.displayProduct;

        parent.appendChild(categoryName);
        this.element = categoryName;
    }
}

