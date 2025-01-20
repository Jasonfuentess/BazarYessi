import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCartOpen: false,
  cart: [],
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },

    addToCart: (state, action) => {
      const { item } = action.payload;
      const existingItem = state.cart.find((cartItem) => cartItem.id === item.id);
    
      if (existingItem) {
        existingItem.count += item.count; // Si ya existe, suma la cantidad
      } else {
        state.cart.push({ ...item, uniqueId: `${item.id}-${Date.now()}` }); // Asegura un identificador único
      }
    },
    
    removeFromCart: (state, action) => {
      const { uniqueId } = action.payload; // Ahora eliminamos por el `uniqueId`
      state.cart = state.cart.filter((cartItem) => cartItem.uniqueId !== uniqueId);
    },

    increaseCount: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item.id === action.payload.id) {
          item.count++;
        }
        return item;
      });
    },

    decreaseCount: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item.id === action.payload.id && item.count > 1) {
          item.count--;
        }
        return item;
      });
    },

    setIsCartOpen: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    clearCart: (state) => {
      state.cart = []; // 🧹 Vacía el carrito completamente
    },
  },
});

export const {
  setItems,
  addToCart,
  removeFromCart,
  increaseCount,
  decreaseCount,
  setIsCartOpen,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
