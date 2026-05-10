import { getApi } from "../script.js";
import { DomList } from "./DomList.js";
import { DomCategory } from "./DomCategory.js";
import { Products } from "./Products.js";

export class Categories extends DomList {
    constructor(orderList) {
        super("categoryContainer");
        this.orderList = orderList;
        this.categoryTitle = document.getElementById('categoryTitle');
        this.product = new Products();
    }

    async display() {
        this.clear();
        if (!this.cachedCategories) {
            this.cachedCategories = await getApi("categories");
        }
        this.putToItems(this.cachedCategories);
        this.renderAll();
        await this.setDefault(this.items[0]['id']);
    }

    prefetchAll() {
        this.items.forEach(item => {
            if (!this.product.cache.has(item.id)) {
                getApi("products", item.id).then(data => {
                    this.product.cache.set(item.id, data);
                });
            }
        });
    }

    putToItems(categories){
        this.items = categories.map(cat => {
            const item = new DomCategory(cat);
            item.displayProduct = async () => {
                if (this.product.isLoading) return;
                const currentActive = document.querySelector('.category.active-category');
                if (currentActive) {
                    currentActive.classList.remove('active-category'); 
                }
                this.categoryTitle.innerText = item.name;
                await this.product.display(item.id);
                item.element.classList.add('active-category');
            }
            return item;
        });   
    }

    async setDefault(defaultId){
        const defaultCategoryBtn = document.getElementById(defaultId);
        defaultCategoryBtn.classList.add('active-category');
        this.categoryTitle.innerText = defaultCategoryBtn.childNodes[3].innerText;
        await this.product.display(defaultCategoryBtn.id)
    }
}
