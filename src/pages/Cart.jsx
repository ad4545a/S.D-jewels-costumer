import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="cart-page pb-5">
            <Container>
                <h1 className="mb-5 fw-bold text-center">Shopping Bag</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="bi bi-bag-x display-1 text-muted opacity-25"></i>
                        <h3 className="mt-4 text-muted">Your bag is empty</h3>
                        <Link to="/shop">
                            <Button variant="outline-dark" className="mt-3 rounded-pill px-4">Continue Shopping</Button>
                        </Link>
                    </div>
                ) : (
                    <Row>
                        {/* Cart Items List */}
                        <Col md={8}>
                            {cartItems.map(item => (
                                <Row key={item.id} className="cart-item-row">
                                    <Col xs={3} sm={2}>
                                        <img src={item.image} alt={item.name} className="cart-img-preview" />
                                    </Col>
                                    <Col xs={9} sm={4}>
                                        <h6 className="fw-bold mb-1">{item.name}</h6>
                                        <small className="text-muted">Item #{item.id}</small>
                                    </Col>
                                    <Col xs={4} sm={3} className="text-center mt-3 mt-sm-0">
                                        <div className="d-flex align-items-center justify-content-center gap-2">
                                            <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                            <span className="fw-bold">{item.quantity}</span>
                                            <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                    </Col>
                                    <Col xs={4} sm={2} className="text-end mt-3 mt-sm-0">
                                        <span className="fw-bold">${(item.price * item.quantity).toLocaleString()}</span>
                                    </Col>
                                    <Col xs={4} sm={1} className="text-end mt-3 mt-sm-0">
                                        <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </Col>
                                </Row>
                            ))}
                        </Col>

                        {/* Order Summary */}
                        <Col md={4}>
                            <div className="cart-summary sticky-top" style={{ top: '120px' }}>
                                <h5 className="fw-bold mb-4">Order Summary</h5>
                                <div className="summary-row">
                                    <span className="text-muted">Subtotal</span>
                                    <span>${cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="summary-row">
                                    <span className="text-muted">Shipping</span>
                                    <span className="text-success">Free</span>
                                </div>
                                <hr />
                                <div className="summary-row fs-5 fw-bold">
                                    <span>Total</span>
                                    <span>${cartTotal.toLocaleString()}</span>
                                </div>

                                <Link to="/checkout" className="text-decoration-none">
                                    <button className="checkout-btn">PROCEED TO CHECKOUT</button>
                                </Link>
                                <div className="text-center mt-3 small text-muted">
                                    <i className="bi bi-lock-fill me-1"></i> Secure Checkout
                                </div>
                            </div>
                        </Col>
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default Cart;
