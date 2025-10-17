// // src/context/StoreContext.js

// import { createContext, useState, useContext, useEffect } from "react";

// const StoreContext = createContext();

// export function StoreProvider({ children }) {
//   const [wishlist, setWishlist] = useState([]);
//   const [cart, setCart] = useState([]);

//   // 🧠 Load wishlist & cart from localStorage on mount
//   useEffect(() => {
//     const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
//     const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     setWishlist(savedWishlist);
//     setCart(savedCart);
//   }, []);

//   // 💾 Save wishlist & cart whenever they change
//   useEffect(() => {
//     localStorage.setItem("wishlist", JSON.stringify(wishlist));
//   }, [wishlist]);

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   // ❤️ Toggle wishlist item
//   const toggleWishlist = (product) => {
//     if (wishlist.find((item) => item.id === product.id)) {
//       setWishlist(wishlist.filter((item) => item.id !== product.id));
//       console.log("Removed from wishlist");
//     } else {
//       setWishlist([...wishlist, product]);
//       console.log("Added to wishlist");
//     }
//   };

//   // 🛒 Add to cart (increment quantity if exists)
//   const addToCart = (product) => {
//     const existing = cart.find((item) => item.id === product.id);

//     if (existing) {
//       const updatedCart = cart.map((item) =>
//         item.id === product.id
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       );
//       setCart(updatedCart);
//       console.log("Increased quantity of product already in cart");
//     } else {
//       const newCart = [...cart, { ...product, quantity: 1 }];
//       setCart(newCart);
//       console.log("Added new product to cart");
//     }
//   };

//   // ❌ Remove from cart
//   const removeFromCart = (id) => {
//     setCart(cart.filter((item) => item.id !== id));
//   };

//   return (
//     <StoreContext.Provider
//       value={{ wishlist, cart, toggleWishlist, addToCart, removeFromCart }}
//     >
//       {children}
//     </StoreContext.Provider>
//   );
// }

// export function useStore() {
//   return useContext(StoreContext);
// }


// ------------------------------------test-1--------------------------------
import { createContext, useState, useContext, useEffect } from "react";

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  
  // Load from localStorage on mount
  useEffect(() => {
    setWishlist(JSON.parse(localStorage.getItem("wishlist")) || []);
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
  }, []);

  // Persist wishlist/cart to localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add/remove wishlist item
  const toggleWishlist = (product) => {
    if (wishlist.find(item => item.id === product.id)) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  // Add to cart
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Remove from cart
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Update quantity
  const updateCartQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCart(cart.map(item => item.id === id ? { ...item, quantity } : item));
  };

  return (
    <StoreContext.Provider value={{
      wishlist,
      cart,
      toggleWishlist,
      addToCart,
      removeFromCart,
      updateCartQuantity
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
