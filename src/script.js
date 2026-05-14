import { Categories } from "./DynamicElements/Categories.js";
import { OrderList } from "./Models/OrderList.js";
export const orderList = new OrderList();


// ===============================================================
// DINING SELECTION

let isDiningSelecting = false;

async function selectDiningOption(option) {
    if (isDiningSelecting) return;
    isDiningSelecting = true;

    orderList.setDiningMethod(option)
    const diningSection = document.getElementById('diningSection');
    const menuSection = document.getElementById('menuSection');
    const diningOptionText = document.getElementById('diningOption');

    diningOptionText.innerText = "Dining Option: " + option;
    diningSection.classList.add('fade-out-up');

    const categoryObject = new Categories();
    await categoryObject.display();

    setTimeout(() => {
        isDiningSelecting = false
        diningSection.classList.add('section-hidden');
        const loading = document.getElementById('loading').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById("loading").classList.add("hidden");
            menuSection.classList.remove('hidden');
            menuSection.classList.add('flex');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 800);
    }, 600);
}


// ===============================================================
// HOME BUTTOM TO RESET THE ORDER

function home() {


    const diningSection = document.getElementById('diningSection');
    const menuSection = document.getElementById('menuSection');

    diningSection.classList.remove('section-hidden', 'fade-out-up');
    menuSection.classList.add('hidden');
    menuSection.classList.remove('flex');

}

document.getElementById('checkoutBtn').disabled = (orderPanel.children.length === 0);

//================================================================
// CHANGE BUTTON

function toggleChange() {
    const changeBtn = document.getElementById('changeBtn');

}

// ===============================================================
// CATEGORY SELECTION 


const categoryButtons = document.querySelectorAll('.category');
const defaultCategoryBtn = document.getElementById('defaultCategory');


if (defaultCategoryBtn) {
    defaultCategoryBtn.classList.add('active-category');
}

// ===============================================================
// ORDER POPUP

const modal = document.getElementById('modalOverlay');
const qtyText = document.getElementById('quantityCount');
let currentQty = 1;

export function openPopup(imgSrc, title, price) {
    document.getElementById('productInfo').innerHTML = `
        <img id="popupImg" src="${imgSrc}" alt="Selected Food"
        class="mb-4 aspect-square w-48 rounded-full border-4 border-[#76a609] object-cover shadow-md">
        <h3 id="popupTitle" class="text-xl font-bold uppercase text-gray-800">${title}</h3>
        <p id="popupPrice" class="text-lg font-bold text-[#76a609]">${price}</p>
    `

    currentQty = 1;
    qtyText.innerText = currentQty;
    modal.classList.remove('hidden');
}

export function closePopup() {
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

function changeQty(id, delta) {
    const targetItem = orderList.products.find(item => item.getId() === parseInt(id));
    targetItem.setQuantity(parseInt(targetItem.getQuantity() + delta));
    orderList.calculateTotalPrice();

    if (targetItem.getQuantity() < 1) {
        removeItem(targetItem.getId());
        document.getElementById('checkoutBtn').disabled = true;
    } else {
        document.getElementById(`order${id}`).innerText = targetItem.getQuantity();
        document.getElementById("totalPrice").innerText = orderList.totalPrice.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });

    }
}

function removeItem(id) {
    orderList.products = orderList.products.filter(orders => orders.getId() != parseInt(id))
    orderList.calculateTotalPrice();
    document.getElementById(`order${id}`).closest('.animate-item-add').remove();
    document.getElementById("totalPrice").innerText = orderList.totalPrice.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
    document.getElementById('checkoutBtn').disabled = true;

}


// ===============================================================
// OPENS CHECKOUT SCREEN

function startCheckout() {
    const menu = document.getElementById('menuSection');
    menu.classList.add('hidden');
    menu.classList.remove('flex');

    const checkout = document.getElementById('checkoutSection');
    checkout.classList.remove('hidden');

    renderSummary();
    showStep('stepSummary', 25);
}

// ===============================================================
// SUMMARY FOR THE ORDER

function renderSummary() {

    const list = document.getElementById('summaryList');
    list.innerHTML = '';

    orderList.products.forEach(item => {
        const row = document.createElement('div');
        row.className = "flex gap-30 items-center text-2xl";
        row.innerHTML = `
            <span class="font-semibold flex-grow text-[#494b43]">${item.getName()}</span>
            <span class="text-sm text-right text-gray-500 ">x${item.getQuantity()}</span>
            <span class="font-bold text-left text-gray-500">${item.getTotalPrice().toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
        `;
        list.appendChild(row);
    });

    document.getElementById('summaryTotal').innerText = document.getElementById('totalPrice').innerText;
}

// ===============================================================
// DETECT THE STEP OF THE CHECKOUT

function showStep(stepId, progress) {
    ['stepSummary', 'stepPayment', 'stepService', 'stepFinal'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });

    document.getElementById(stepId).classList.remove('hidden');

    document.getElementById('progressBar').style.width = progress + '%';
}

// ===============================================================
// GO BACK TO THE ORDER MENU

function backToMenu() {
    document.getElementById('checkoutSection').classList.add('hidden');
    document.getElementById('checkoutSection').classList.remove('flex');
    document.getElementById('menuSection').classList.remove('hidden');
    document.getElementById('menuSection').classList.add('flex');

}

// ===============================================================
// SELECT PAYMENT METHOD

async function selectPaymentMethod(method) {
    console.log(method)
    const paymentMethod = (method === "cashless") ? "cashless" : "cash";
    let orderObject = [];
    for (let orders of orderList.products) {
        orderObject.push({
            "productId": orders.getId(),
            "quantity": orders.getQuantity()
        })
    }
    let checkoutInfo = await postApi("neworder", {
        "paymentMethod": paymentMethod,
        "restoName": getCookie("resto"),
        "orders": orderObject
    });

    orderList.orderId = checkoutInfo["orderId"];

    if (paymentMethod === "cashless") {
        checkout(checkoutInfo)
    } else {
        console.log("next")
        showStep('stepService', 75);
    }
}

// ===============================================================
// MAKES A POP UP WINDOW IF PAYMENT IS CASHLESS

async function checkout(checkoutInfo) {
    const width = 800;
    const height = 800;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    const checkoutPopup = window.open(checkoutInfo["url"], 'paymongo_checkout',
        `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=yes`
    );

    const interval = setInterval(async () => {
        const response = await getApi("checkpaid", checkoutInfo["id"])
        if (await response["data"]["attributes"]["payments"].length != 0) {
            clearInterval(interval);
            checkoutPopup.close();
            showStep('stepService', 75);
        } else if (checkoutPopup.closed) {
            clearInterval(interval);
            window.alert("payment cancelled")
        }
    }, 2000);
}

// ===============================================================
// FINISH THE CHECKOUT

function completeCheckout() {
    document.getElementById('finalOrderNumber').innerText = orderList.orderId.slice(-4);
    showStep('stepFinal', 100);
}

// ===============================================================
// RESET THE KIOSK FROM THE START AFTER THE ORDER

function resetToStart() {
    let orderpanel = document.getElementById('orderPanel');
    orderList.resetOrder();
    orderpanel.innerHTML = '';
    document.getElementById('totalPrice').innerText = '₱ 0.00';

    document.getElementById('checkoutBtn').disabled = true;


    setTimeout(() => {
        document.getElementById('checkoutSection').classList.add('hidden');
        document.getElementById('checkoutSection').classList.remove('flex');
        document.getElementById('loading').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('loading').classList.add('hidden');
        }, 800);
    }, 600);
    document.getElementById('diningSection').classList.remove('section-hidden', 'fade-out-up');
    window.scrollTo(0, 0);


    const diningSection = document.getElementById('diningSection');
    diningSection.classList.remove('section-hidden', 'fade-out-up');

    showStep('stepSummary', 25);

    window.scrollTo(0, 0);

}

document.getElementById('checkoutBtn').disabled = true;

// ===============================================================
// API CONNECTORS

export async function postApi(target, body) {
    let response = await fetch(`https://kosina-api.up.railway.app/${target}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Bearer ${getCookie("token")}`
        },
        body: JSON.stringify(body)
    })
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

export async function getApi(target, id = "") {
    let response = await fetch(`https://kosina-api.up.railway.app/${target}/${id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${getCookie("token")}`
        }
    })
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

// ===============================================================
// LOGIN SCREEN
const loginButton = document.getElementById("loginButton");
const username = document.getElementById("username");
const password = document.getElementById("password");
const loginPanel = document.getElementById('loginPanel');
const diningSection = document.getElementById('diningSection');

async function submit() {
    let data = await postApi("login", {
        "username": username.value,
        "password": password.value
    });

    setTimeout(() => {
        loginPan.classList.add("hidden");
        loginPanel.classList.add('hidden');
        document.getElementById("loading").classList.remove("hidden");

        setTimeout(() => {
            document.getElementById("loading").classList.add("hidden");
            diningSection.classList.remove('hidden');
        }, 800);
    }, 400);

    username.value = "";
    password.value = "";

    if (data["status"] === "error") { window.alert(`${data["message"]}`); }
    else {
        saveToCookie(data);
    }
}

// ===============================================================
// SAVE THE RESTO DATA TO COOKIE 

function saveToCookie(data) {
    document.cookie = `token=${data["token"]}; max-age=${data["expiration"]}; path=/`
    document.cookie = `name=${data["name"]}; max-age=${data["expiration"]}; path=/`
    document.cookie = `resto=${data["resto"]}; max-age=${data["expiration"]}; path=/`
}

// ===============================================================
// GET DATA FROM COOKIE

function getCookie(target) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name.trim() === target) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

// ===============================================================
// LOG OUT THE ACCOUNT FROM THE KIOSK

function logout() {
    document.cookie = "token= ;max-age=0; path=/;";
    document.cookie = "name= ;max-age=0; path=/;";
    document.cookie = "resto= ;max-age=0; path=/;";
    location.reload();
}

// ===============================================================
// CHECK IF TOKEN EXIST IN THE COOKIE
const loginPan = document.getElementById('loginPan');

function goToAutho() {
    loginPanel.classList.remove('hidden');
    loginPanel.classList.add('flex');
    loginPan.classList.add("hidden");
}

function closeAutho() {
    loginPanel.classList.add('hidden');
    const loginPan = document.getElementById('loginPan');
    loginPan.classList.remove("hidden");
}

async function checkToken() {
    let data = await getApi("return");
    if (data["status"] === "error") {
        loginPan.classList.remove("hidden");
    } else {
        diningSection.classList.remove('hidden');
    }
}

checkToken();

// ===============================================================
// MAKES IT POSSIBLE FOR HTML TO CALL THESE FUNCTIONS FURING 

window.submit = submit;
window.selectDiningOption = selectDiningOption;
window.home = home;
window.updateQty = updateQty;
window.changeQty = changeQty;
window.removeItem = removeItem;
window.closePopup = closePopup;
window.startCheckout = startCheckout;
window.backToMenu = backToMenu;
window.showStep = showStep;
window.selectPaymentMethod = selectPaymentMethod;
window.completeCheckout = completeCheckout;
window.resetToStart = resetToStart;
window.toggleMenu = toggleMenu;
window.goToAutho = goToAutho;
window.closeAutho = closeAutho;

fetch("https://kosina-api.up.railway.app/ping").catch(() => { });



function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const burger = document.getElementById('burger');

    sidebar.classList.toggle('hidden');

    // Toggle the 'open' class to trigger the animation
    burger.classList.toggle('open');

    // Your existing margin toggle
    burger.classList.toggle('ml-23');
}