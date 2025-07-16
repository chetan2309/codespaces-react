import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';

const AddToCart = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart, cartItems } = useContext(CartContext);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (!product || !product.id) {
      toast.error('Invalid product');
      return;
    }

    if (quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available in stock`);
      return;
    }

    // Check if adding this quantity would exceed stock
    const existingItem = cartItems.find(item => item.id === product.id);
    const currentCartQuantity = existingItem ? existingItem.quantity : 0;
    const totalQuantity = currentCartQuantity + quantity;

    if (totalQuantity > product.stock) {
      toast.error(`Cannot add ${quantity} items. Only ${product.stock - currentCartQuantity} more available`);
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });

      toast.success(`${quantity} ${product.name}(s) added to cart!`);
      setQuantity(1); // Reset quantity after successful add
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isOutOfStock = product.stock === 0;
  const maxQuantity = Math.min(product.stock, 99); // Limit max quantity to 99

  return (
    <div className="add-to-cart-container">
      <div className="quantity-selector">
        <label htmlFor="quantity">Quantity:</label>
        <input
          id="quantity"
          type="number"
          min="1"
          max={maxQuantity}
          value={quantity}
          onChange={handleQuantityChange}
          disabled={isOutOfStock || isLoading}
          className="quantity-input"
        />
        <span className="stock-info">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </span>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock || isLoading || quantity <= 0}
        className={`add-to-cart-btn ${isOutOfStock ? 'out-of-stock' : ''} ${isLoading ? 'loading' : ''}`}
      >
        {isLoading ? (
          <>
            <span className="spinner"></span>
            Adding...
          </>
        ) : isOutOfStock ? (
          'Out of Stock'
        ) : (
          `Add ${quantity} to Cart - $${(product.price * quantity).toFixed(2)}`
        )}
      </button>

      {product.stock <= 5 && product.stock > 0 && (
        <div className="low-stock-warning">
          ⚠️ Only {product.stock} left in stock!
        </div>
      )}
    </div>
  );
};

export default AddToCart;