import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const ProductCard = ({ id, image, name, price, countInStock }) => {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();
    const isWishlisted = isInWishlist(id);
    const product = { id, image, name, price, countInStock };

    const isOutOfStock = countInStock <= 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isOutOfStock) {
            addToCart(product);
        }
    };

    return (
        <div className={`product-card-modern position-relative ${isOutOfStock ? 'opacity-75' : ''}`}>
            {isOutOfStock && (
                <div className="position-absolute top-0 start-0 m-2 badge bg-secondary text-white shadow-sm" style={{ zIndex: 10 }}>
                    Sold Out
                </div>
            )}

            {/* Wishlist Heart Button */}
            <button
                className="btn position-absolute top-0 end-0 m-2 rounded-circle d-flex align-items-center justify-content-center shadow-sm wishlist-btn"
                onClick={() => toggleWishlist(product)}
                style={{
                    zIndex: 5,
                    width: '35px',
                    height: '35px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease'
                }}
            >
                <i className={`bi ${isWishlisted ? 'bi-heart-fill text-danger' : 'bi-heart text-dark'}`} style={{ fontSize: '1.1rem' }}></i>
            </button>

            <div className="product-img-container">
                <Link to={`/product/${id || 1}`} className="text-decoration-none d-block">
                    <img src={image} alt={name} style={{ filter: isOutOfStock ? 'grayscale(0.5)' : 'none' }} />
                </Link>
                <div className="card-action">
                    <Button
                        variant={isOutOfStock ? "secondary" : "dark"}
                        size="sm"
                        className="rounded-pill px-4"
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                    >
                        {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                    </Button>
                </div>
            </div>

            <div className="product-info mt-3">
                <Link to={`/product/${id || 1}`} className="text-decoration-none text-dark">
                    <h5 className="product-title">{name}</h5>
                    <p className="product-price fw-bold">${price?.toLocaleString() || '0'}</p>
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;
