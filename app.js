// Shared product data and localStorage key
const STORAGE_KEY = 'hp_cart_v1';
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

function loadCartFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
    } catch (e) {
        console.error('Failed to parse cart from storage', e);
    }
    return [];
}

function saveCartToStorage(cart) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
        console.error('Failed to save cart to storage', e);
    }
}

// Product listing app (mounted on index page)
if (document.querySelector('#featuredItems')) {
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
                if (!product) return;
                const index = this.cart.findIndex(p => p.id == id);
                if (index !== -1) {
                    this.cart[index].quantity++;
                } else {
                    this.cart.push({ ...product, quantity: 1 });
                }
                saveCartToStorage(this.cart);
                console.log('Cart updated', this.cart);
            }
        }
    }).mount('#featuredItems');
}

// Cart page app (mounted on cart.html)
if (document.querySelector('#cartApp')) {
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
                const idx = this.cart.findIndex(p => p.id == id);
                if (idx !== -1) {
                    this.cart[idx].quantity++;
                    saveCartToStorage(this.cart);
                }
            },
            reduceItem(id) {
                const idx = this.cart.findIndex(p => p.id == id);
                if (idx === -1) return;
                if (this.cart[idx].quantity > 1) {
                    this.cart[idx].quantity--;
                } else {
                    this.cart.splice(idx, 1);
                }
                saveCartToStorage(this.cart);
            },
            removeItem(id) {
                const idx = this.cart.findIndex(p => p.id == id);
                if (idx !== -1) {
                    this.cart.splice(idx, 1);
                    saveCartToStorage(this.cart);
                }
            },
            clearCart() {
                this.cart = [];
                saveCartToStorage(this.cart);
            }
        }
    }).mount('#cartApp');
}
