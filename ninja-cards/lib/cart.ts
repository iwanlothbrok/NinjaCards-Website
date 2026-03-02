'use client';
import { useEffect, useState } from "react";

export type CartItemType =

    | "design"
    | "nfc_card"
    | "trial"
    | "subscription";


// CartItem interface
export interface CartItem {
    type: CartItemType;
    name: string;
    photoUrl: string;
    price: number;
    isFree: boolean;
    quantity: number;
    priceId: string;
    subscriptionType?: 'monthly' | 'yearly';
}

// Cart interface
export interface Cart {
    items: CartItem[];         // List of items in the cart
    totalPrice: number;        // Total price of items in the cart (excluding free items)
    freeItemsCount: number;    // Count of free items in the cart
}
// Simplified addToCart function
// Simplified addToCart function for each design
export function addToCart(cart: Cart, item: CartItem): Cart {
    const updatedCart: Cart = {
        ...cart,
        items: [...cart.items], // Copy the items array to avoid mutating the original
        totalPrice: cart.totalPrice,
        freeItemsCount: cart.freeItemsCount
    };


    console.log('item is: ', item);

    // Pricing logic for designs
    let price = item.price; // Default price for design items
    let isFree = item.isFree;
    let priceId = item.priceId;
    // Create the new item to add
    const newItem: CartItem = {
        ...item,
        price,
        isFree,
        priceId
    };

    // Add free base items (NFC Card and Trial) if they're not already in the cart
    const freeItems: CartItem[] = [
        {
            type: "nfc_card",
            name: "Ninja Card - NFC Card",
            photoUrl: "/cards/nfc-card.png",
            price: 0,
            isFree: true,
            quantity: 1,
            priceId: "price_1T4dPuBMFJ6zM7JJhVKEFFGm"
        },
        {
            type: "trial",
            name: "30 Days Free Trial",
            photoUrl: "/cards/trial.png",
            price: 0,
            isFree: true,
            quantity: 1,
            priceId: ""
        },
    ];

    freeItems.forEach((item) => {
        if (!updatedCart.items.some((cartItem) => cartItem.type === item.type)) {
            updatedCart.items.push(item);
        }
    });

    // Add the selected card item (design)
    updatedCart.items.push(newItem);

    // Recalculate totals
    updatedCart.totalPrice = updatedCart.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
    );

    updatedCart.freeItemsCount = updatedCart.items.reduce(
        (sum, i) => sum + (i.isFree ? i.quantity : 0),
        0
    );

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    return updatedCart; // Return the updated cart
}

// Function to remove an item from the cart
export function removeFromCart(cart: Cart, index: number): Cart {
    const removedItem = cart.items[index];
    const updatedItems = cart.items.filter((_, i) => i !== index);
    const updatedCart = {
        ...cart,
        items: updatedItems,
        totalPrice: cart.totalPrice - removedItem.price * removedItem.quantity,  // Subtract price of removed item
        freeItemsCount: cart.freeItemsCount - (removedItem.isFree ? removedItem.quantity : 0)
    };

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    return updatedCart;
}

// Function to load cart from localStorage
export function loadCartFromLocalStorage(): Cart {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
        return JSON.parse(cartData);
    }
    return { items: [], totalPrice: 0, freeItemsCount: 0 };
}

export function useCart() {
    const [cartItemCount, setCartItemCount] = useState(0);

    // Function to load the cart from localStorage
    const loadCartFromLocalStorage = () => {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            return JSON.parse(cartData);
        }
        return { items: [], totalPrice: 0, freeItemsCount: 0 };
    };

    // Update the state whenever cart is modified
    const updateCartItemCount = () => {
        const savedCart = loadCartFromLocalStorage();
        setCartItemCount(savedCart && Array.isArray(savedCart.items) ? savedCart.items.length : 0);
    };

    useEffect(() => {
        // Initialize cart count on first load
        updateCartItemCount();

        // Listen for localStorage changes to update the count when other parts of the app modify the cart
        const storageListener = () => {
            updateCartItemCount();
        };

        window.addEventListener("storage", storageListener);
        return () => window.removeEventListener("storage", storageListener);
    }, [updateCartItemCount]);

    return cartItemCount;
}

export function clearCart(): void {
    localStorage.removeItem('cart');
}