import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const StoreContext = createContext(null);
const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000"
  const [token,setToken] = useState("")
  const [food_list,setFoodList] = useState([])
  
  const addToCart = async(itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
      if (token){
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
        }
  };

  const removeFromCart =async(itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }
  };

const getTotalCartAmount = () => {
  let totalAmount = 0;
  for (const itemId in cartItems) {
    const quantity = cartItems[itemId];
    if (quantity > 0) {
      const itemInfo = food_list.find(product => product._id.toString() === itemId);
      if (itemInfo) {
        totalAmount += itemInfo.price * quantity;
      }
    }
  }
  return totalAmount;
};

const fetchFoodList = async () => {
        const response = await axios.get(url+"/api/food/list");
        setFoodList(response.data.data)
    }
const loadCartData = async (token) => {
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCartItems(response.data.cartData);
    }
  useEffect(()=>{
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    },[])
  const contextvalue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
   setToken
  };

  return (
    <StoreContext.Provider value={contextvalue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
