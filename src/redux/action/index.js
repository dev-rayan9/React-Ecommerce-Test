// For Add Item to Cart
export const addCart = (product) =>{
    return {
        type:"ADDITEM",
        payload:product
    }
}

// For Delete Item to Cart
export const delCart = (product) =>{
    return {
        type:"DELITEM",
        payload:product
    }
}

// For Remove Item entirely from Cart
export const removeCart = (product) => {
    return {
        type: "REMOVEITEM",
        payload: product
    }
}