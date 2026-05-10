export class DomList {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.items = [];
    }

    clear() {
        this.container.innerHTML = '';
    }

    display(){
        //IMPLEMENT THIS
    }

    changeTitle(title){
        document.getElementById('categoryTitle').innerHTML = title
    }

    getFirstCategory(){
        return document.getElementsByClassName('categoryButtons')[0]
    }

    //Render all of the HTML builder to the screen
    renderAll() {
        this.items.forEach(item => item.render(this.container));
    }
}

 