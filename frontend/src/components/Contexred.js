import React, { createContext, useContext, useReducer } from "react";

const CardStateContext = createContext();
const CardDispatchContext = createContext();
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        {
          id: action.id,
          name: action.name,
          price: action.price,
          qntity: parseInt(action.qntity),
          size: action.size,
          img: action.img,
        },
      ];
    case "REMOVE":
      let newArr = [...state];
      newArr.splice(action.index, 1);
      return newArr;
    case "DROP":
      let empArray = [];
      return empArray;
    case "UPDATE":
      let arr = [...state];
      arr.find((food, index) => {
        if (food.id === action.id) {
          console.log(
            food.qntity+action.qntity,
            parseInt(action.qty),
            action.price + food.price
          );
          arr[index] = {
            ...food,
            qntity: parseInt(action.qntity) + food.qntity,
            price: action.price + food.price,
          };
        }
        return arr;
      });
      return arr;
    default:
      console.log("error");
  }
};
export const Cardprovider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, []);
  return (
    <CardDispatchContext.Provider value={dispatch}>
      <CardStateContext.Provider value={state}>
        {children}
      </CardStateContext.Provider>
    </CardDispatchContext.Provider>
  );
};

export const useCart = () => useContext(CardStateContext);
export const useDispatchCart = () => useContext(CardDispatchContext);
