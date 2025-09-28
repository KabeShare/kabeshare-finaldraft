'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Conditional Clerk imports
let useAuth, useUser;
try {
  const clerkHooks = require('@clerk/nextjs');
  useAuth = clerkHooks.useAuth;
  useUser = clerkHooks.useUser;
} catch (error) {
  console.warn('Clerk not available, using mock hooks');
  useAuth = () => ({ getToken: () => null });
  useUser = () => ({ user: null });
}
// import { productsDummyData, userDummyData } from "@/assets/assets";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();

  // Safe hook usage with fallbacks
  let user, getToken;
  try {
    const userHook = useUser();
    const authHook = useAuth();
    user = userHook?.user || null;
    getToken = authHook?.getToken || (() => Promise.resolve(null));
  } catch (error) {
    console.warn('Clerk hooks not available:', error);
    user = null;
    getToken = () => Promise.resolve(null);
  }

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState({});

  const fetchProductData = async () => {
    try {
      const { data } = await axios.get('/api/product/list');

      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
      //   setProducts(productsDummyData);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUserData = async () => {
    try {
      if (user.publicMetadata.role === 'seller') {
        setIsSeller(true);
      }

      const token = await getToken();

      const { data } = await axios.get('/api/user/data', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user);
        setCartItems(data.user.cartItems);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addToCart = async (itemId) => {
    if (!user) {
      return toast('Please login', {
        icon: '⚠️',
      });
    }

    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    if (user) {
      try {
        const token = await getToken();
        await axios.post(
          '/api/cart/update',
          { cartData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Item added to cart');
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);
    if (user) {
      try {
        const token = await getToken();
        await axios.post(
          '/api/cart/update',
          { cartData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Cart Updated');
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        totalCount += cartItems[items];
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    try {
      for (const items in cartItems) {
        let itemInfo = products.find((product) => product?._id === items);
        if (cartItems[items] > 0 && itemInfo?.offerPrice) {
          totalAmount += itemInfo.offerPrice * cartItems[items];
        }
      }
    } catch (error) {
      console.error('Error calculating cart amount:', error);
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const value = {
    user,
    getToken,
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    products,
    fetchProductData,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
