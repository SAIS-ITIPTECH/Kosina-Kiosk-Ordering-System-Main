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

        categoryName.className = `
        category flex-shrink-0 px-8 py-3 
        rounded-2xl font-bold uppercase text-[14px] tracking-wide
        bg-[#494b43] text-white transition-all duration-200
        hover:bg-[#76a609] hover:text-white 
        focus:bg-[#76a609] focus:text-white focus:shadow-lg
    `.trim();

        categoryName.innerHTML = `${this.name}`;

        categoryName.value = this.index;
        categoryName.id = this.value;

        categoryName.onclick = (event) => {
            document.querySelectorAll('.category').forEach(btn => {
                btn.classList.remove('bg-[#76a609]', 'text-white');
                btn.classList.add('bg-[#494b43]', 'text-white');
            });
            categoryName.classList.add('bg-[#76a609]', 'text-white');

            this.displayProduct(event);
            categoryName.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        };

        parent.appendChild(categoryName);
        this.element = categoryName;
    }
}

