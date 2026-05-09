// ===============================================================
// DINING SELECTION

function selectDiningOption(option) {
    const diningSection = document.getElementById('diningSection');
    const menuSection = document.getElementById('menuSection');
    const diningOptionText = document.getElementById('diningOption');

    diningOptionText.innerText = "Dining Option: " + option;
    diningSection.classList.add('fade-out-up');

    setTimeout(() => {
        diningSection.classList.add('section-hidden');

        menuSection.classList.remove('hidden');
        menuSection.classList.add('flex');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
}

function home() {
    const diningSection = document.getElementById('diningSection');
    const menuSection = document.getElementById('menuSection');

    diningSection.classList.remove('section-hidden', 'fade-out-up');
    menuSection.classList.add('hidden');
    menuSection.classList.remove('flex');
}

document.getElementById('checkoutBtn').disabled = (orderPanel.children.length === 0);


// ===============================================================
// CATEGORY SELECTION 


const categoryTitle = document.getElementById('categoryTitle');
const categoryButtons = document.querySelectorAll('.category');
const defaultCategoryBtn = document.getElementById('defaultCategory');


if (defaultCategoryBtn) {
    defaultCategoryBtn.classList.add('active-category');
}

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const categoryName = button.querySelector('.categoryName').innerText;

        categoryTitle.innerText = categoryName;

        const currentActive = document.querySelector('.category.active-category');
        if (currentActive) {
            currentActive.classList.remove('active-category');
        }

        button.classList.add('active-category');

    });
})


// ===============================================================
// ORDER POPUP


const modal = document.getElementById('modalOverlay');
const qtyText = document.getElementById('quantityCount');
let currentQty = 1;

function openPopup(imgSrc, title, price) {
    document.getElementById('popupImg').src = imgSrc;
    document.getElementById('popupTitle').innerText = title;
    document.getElementById('popupPrice').innerText = price;

    currentQty = 1;
    qtyText.innerText = currentQty;

    modal.classList.remove('hidden');
}

function closePopup() {
    modal.classList.add('hidden');
}

function updateQty(amount) {
    currentQty += amount;
    if (currentQty < 1) currentQty = 1;
    qtyText.innerText = currentQty;
}

document.querySelectorAll('.grid button.group').forEach(btn => {
    btn.addEventListener('click', () => {
        const imgSrc = btn.querySelector('img').src;
        const title = btn.querySelector('h3').innerText;
        const price = btn.querySelector('p').innerText;
        openPopup(imgSrc, title, price);
    });
});






// ===============================================================
// ORDER LIST



let orderItems = [];

function addToOrder() {
    const title = document.getElementById('popupTitle').innerText;
    const priceText = document.getElementById('popupPrice').innerText;
    const price = parseFloat(priceText.replace('₱', '').trim());
    const image = document.getElementById('popupImg').src;
    const qty = parseInt(document.getElementById('quantityCount').innerText);
    const orderPanel = document.getElementById('orderPanel');


    const existingItem = orderItems.find(item => item.name === title);

    if (existingItem) {
        existingItem.quantity += qty;
    } else {
        orderItems.push({
            name: title,
            price: price,
            image: image,
            quantity: qty
        });
    }

    document.getElementById('checkoutBtn').disabled = false;

    renderOrder();
    closePopup();
}

function renderOrder() {
    const panel = document.getElementById('orderPanel');
    panel.innerHTML = '';
    let total = 0;

    orderItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        panel.innerHTML += `
            <div class="flex items-center gap-3 border-b pb-4">
                <img src="${item.image}" class="h-12 w-12 rounded object-cover border border-gray-200">
                <div class="flex-1">
                    <p class="text-sm font-bold uppercase">${item.name}</p>
                    <p class="text-xs text-[#76a609] font-bold">₱ ${item.price.toFixed(2)}</p>
                </div>
                
                <!-- Edit Quantity Controls -->
                <div class="flex items-center gap-2">
                    <button onclick="changeQty(${index}, -1)" class="h-6 w-6 rounded bg-gray-100 text-xs font-bold">-</button>
                    <span class="text-sm font-bold w-4 text-center">${item.quantity}</span>
                    <button onclick="changeQty(${index}, 1)" class="h-6 w-6 rounded bg-[#d8e0c6] text-[#76a609] text-xs font-bold">+</button>
                    <button onclick="removeItem(${index})" class="ml-2 text-red-400 hover:text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        `;
    });

    document.getElementById('subtotal').innerText = `₱ ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    document.getElementById('totalPrice').innerText = `₱ ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

function changeQty(index, delta) {
    orderItems[index].quantity += delta;
    if (orderItems[index].quantity < 1) {
        removeItem(index);
    } else {
        renderOrder();
    }
}

function removeItem(index) {
    orderItems.splice(index, 1);
    renderOrder();
}



// ===============================================================
// 



function startCheckout() {
    document.getElementById('menuSection').classList.add('hidden');
    document.getElementById('menuSection').classList.remove('flex');

    const checkout = document.getElementById('checkoutSection');
    checkout.classList.remove('hidden');
    checkout.classList.add('flex');

    renderSummary();
    showStep('stepSummary', 25);
}

function renderSummary() {

    const list = document.getElementById('summaryList');
    list.innerHTML = '';

    orderItems.forEach(item => {
        const row = document.createElement('div');
        row.className = "flex justify-between items-center text-2xl";
        row.innerHTML = `
            <span class="font-bold text-gray-600">${item.name}</span>
            <span class="text-sm text-gray-500 ">x${item.quantity}</span>
            <span class="font-bold text-gray-500">₱ ${(item.price * item.quantity).toFixed(2)}</span>
        `;
        list.appendChild(row);
    });

    document.getElementById('summaryTotal').innerText = document.getElementById('totalPrice').innerText;
}

function showStep(stepId, progress) {
    ['stepSummary', 'stepPayment', 'stepService', 'stepFinal'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });

    document.getElementById(stepId).classList.remove('hidden');

    document.getElementById('progressBar').style.width = progress + '%';
}

function backToMenu() {
    document.getElementById('checkoutSection').classList.add('hidden');
    document.getElementById('checkoutSection').classList.remove('flex');
    document.getElementById('menuSection').classList.remove('hidden');
    document.getElementById('menuSection').classList.add('flex');
}

function completeCheckout() {
    const num = Math.floor(Math.random() * 99) + 1;
    document.getElementById('finalOrderNumber').innerText = num.toString().padStart(2, '0');

    showStep('stepFinal', 100);
}

function resetToStart() {
    let orderpanel = document.getElementById('orderPanel');
    orderItems = [];
    orderpanel.innerHTML = '';
    document.getElementById('subtotal').innerText = '₱ 0.00';
    document.getElementById('totalPrice').innerText = '₱ 0.00';

    document.getElementById('checkoutBtn').disabled = true;

    document.getElementById('checkoutSection').classList.add('hidden');
    document.getElementById('checkoutSection').classList.remove('flex');

    const diningSection = document.getElementById('diningSection');
    diningSection.classList.remove('section-hidden', 'fade-out-up');

    showStep('stepSummary', 25);

    window.scrollTo(0, 0);
}

document.getElementById('checkoutBtn').disabled = true;
