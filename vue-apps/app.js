const productsData = [
    {
        id: 1,
        image: "product-1.jpg",
        name: "EvoShield Pro-SRZ 2.0 Batter's Leg Guard",
        description: "Custom-molded Gel-to-Shell technology provides industry-leading protection without sacrificing mobility at the plate.industry-leading protection without sacrificing mobilit",
        price: 69.99
    },
    {
        id: 2,
        image: "product-2.jpg",
        name: "2022 Easton Speed BBCOR Baseball Bat, -3",
        description: "The 2022 Easton Speed BBCOR Baseball Bat is designed for players looking for a high-performance bat that delivers exceptional speed and power.",
        price: 79.99
    },
    {
        id: 3,
        image: "product-3.jpg",
        name: "Wilson A2000 12.75\" Outfield Glove",
        description: "Crafted with Pro Stock Leather, this glove offers rugged durability and an unmatched feel for making those clutch catches in the deep outfield.",
        price: 279.95
    },
    {
        id: 4,
        image: "product-4.jpg",
        name: "Rawlings Official MLB Game Baseball",
        description: "The official ball of Major League Baseball, featuring a full-grain leather cover and 108 raised red stitches for the perfect grip.The official ball of Major League Baseball",
        price: 24.99
    },
];


// LOCAL STORAGE
const STORAGE_KEY = 'cart';

function loadCartFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
    } catch (err) {
        console.error('Failed to load cart from storage', err);
    }
    return [];
}

function saveCartToStorage(cart) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
        console.error('Failed to save cart to storage', err);
    }
}




// Acount and wishlist modals (mounted on nav page)
Vue.createApp({

    methods: {
        navModal() {
            var popoverTriggerList = Array.prototype.slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
            popoverTriggerList.forEach(function (popoverTriggerEl) {
                new bootstrap.Popover(popoverTriggerEl, {
                    html: true,
                    sanitize: false,
                    container: popoverTriggerEl.getAttribute('data-bs-container') || 'body',
                    trigger: 'click'
                });
            })
        },
    },
    }).mount('#navModals');


// Product listing app (mounted on index page)
Vue.createApp({
    data() {
        return {
            products: productsData,
            cart: loadCartFromStorage(),
        };
    },
    methods: {
        addProduct(id) {
            const product = this.products.find(p => p.id == id);


            this.cart.push({...product, quantity: 1});


            saveCartToStorage(this.cart);

        },

    }

}).mount('#featuredItems');


Vue.createApp({
    data() {
        return {
            cart: loadCartFromStorage(),
        };
    },
    computed: {
        subtotal() {
            return this.cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0).toFixed(2);
        }
    },
    methods: {
        addItem(id) {

            this.cart.quantity++;

            saveCartToStorage(this.cart);


        },
        reduceItem(id) {
            const index = this.cart.findIndex(p => p.id == id);

            this.cart.splice(index, 1);


            saveCartToStorage(this.cart);
        },
        removeItem(id) {
            const idx = this.cart.findIndex(p => p.id == id);
            if (idx !== -1) {
                this.cart.splice(idx, 1);


                saveCartToStorage(this.cart);

            }
        }
    }
}).mount('#cartApp');

// --- Modal helpers ---
const modalApp = Vue.createApp({
    methods: {
        goToShipping() {
            const orderEl = document.getElementById('orderModal');
            const shipEl = document.getElementById('shippingModal');


                const orderModal = bootstrap.Modal.getOrCreateInstance(orderEl);
                const shipModal = bootstrap.Modal.getOrCreateInstance(shipEl);
                orderEl.addEventListener('hidden.bs.modal', function onHidden() {
                    shipModal.show();
                    orderEl.removeEventListener('hidden.bs.modal', onHidden);
                });
                orderModal.hide();
        },
        goToPayment() {
            const shipEl = document.getElementById('shippingModal');
            const paymentEl = document.getElementById('paymentModal');

                const shipModal = bootstrap.Modal.getOrCreateInstance(shipEl);
                const paymentModal = bootstrap.Modal.getOrCreateInstance(paymentEl);
                shipEl.addEventListener('hidden.bs.modal', function onHidden() {
                    paymentModal.show();
                    shipEl.removeEventListener('hidden.bs.modal', onHidden);
                });
                shipModal.hide();

        }
    }
});

const modalVm = modalApp.mount('#modals');

goToShipping = () => modalVm.goToShipping();
goToPayment = () =>  modalVm.goToPayment();

