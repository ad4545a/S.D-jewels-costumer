import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Modal, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaTruck, FaCreditCard, FaMoneyBillWave, FaMobileAlt, FaUniversity, FaWallet, FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa';
import './Checkout.css';
import { API_URL } from '../config';

const PAYMENT_METHODS = [
    { id: 'cod', name: 'Cash on Delivery', icon: FaMoneyBillWave, description: 'Pay when you receive your order' },
    { id: 'upi', name: 'UPI', icon: FaMobileAlt, description: 'Google Pay, PhonePe, Paytm UPI' },
    { id: 'card', name: 'Credit / Debit Card', icon: FaCreditCard, description: 'Visa, Mastercard, RuPay' },
    { id: 'netbanking', name: 'Net Banking', icon: FaUniversity, description: 'All major banks supported' },
    { id: 'wallet', name: 'Wallets', icon: FaWallet, description: 'Paytm, Amazon Pay, etc.' },
];

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [showSuccess, setShowSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState('');

    const [userAddress, setUserAddress] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        address: '', city: '', postalCode: '', country: 'India'
    });

    useEffect(() => {
        if (cartItems.length === 0 && !showSuccess) {
            navigate('/cart');
        }
        window.scrollTo(0, 0);
    }, [cartItems, navigate, showSuccess]);

    const handleAddressChange = (e) => {
        setUserAddress({ ...userAddress, [e.target.name]: e.target.value });
    };

    const handleNextStep = () => {
        // Basic validation before moving to next step
        if (currentStep === 1) {
            if (!userAddress.firstName || !userAddress.address || !userAddress.city || !userAddress.postalCode || !userAddress.phone) {
                alert('Please fill all required shipping details.');
                return;
            }
        }
        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async () => {
        if (!selectedPayment) {
            alert('Please select a payment method.');
            return;
        }

        if (!user || !user.token) {
            alert("Please login to place an order");
            navigate('/login');
            return;
        }

        const orderItems = cartItems.map(item => ({
            name: item.name,
            qty: item.quantity,
            image: item.image,
            price: item.price,
            product: item.id
        }));

        const orderData = {
            orderItems,
            shippingAddress: {
                address: userAddress.address,
                city: userAddress.city,
                postalCode: userAddress.postalCode,
                country: userAddress.country,
                phone: userAddress.phone,
            },
            paymentMethod: selectedPayment,
            itemsPrice: cartTotal,
            taxPrice: 0,
            shippingPrice: 0,
            totalPrice: cartTotal
        };

        try {
            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(orderData)
            });

            const data = await res.json();

            if (res.ok) {
                setOrderId(data.orderId);
                setShowSuccess(true);
                setTimeout(() => {
                    clearCart();
                }, 2000);
            } else {
                alert(data.message || "Order Failed");
            }
        } catch (error) {
            console.error("Order error:", error);
            alert("Something went wrong");
        }
    };

    const handleClose = () => {
        setShowSuccess(false);
        navigate('/');
    };

    // --- Steps Indicator ---
    const StepIndicator = () => (
        <div className="step-indicator mb-5">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                <div className="step-icon"><FaTruck /></div>
                <span>Shipping</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                <div className="step-icon"><FaCreditCard /></div>
                <span>Payment</span>
            </div>
        </div>
    );

    // --- Step 1: Shipping Details ---
    const ShippingStep = () => (
        <div className="checkout-form-container">
            <h4 className="mb-4 fw-bold">Shipping Details</h4>
            <Form>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name *</Form.Label>
                            <Form.Control type="text" required name="firstName" value={userAddress.firstName} onChange={handleAddressChange} />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" name="lastName" value={userAddress.lastName} onChange={handleAddressChange} />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" name="email" value={userAddress.email} onChange={handleAddressChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Phone Number *</Form.Label>
                    <Form.Control type="tel" required name="phone" placeholder="+91" value={userAddress.phone} onChange={handleAddressChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Address *</Form.Label>
                    <Form.Control type="text" required name="address" value={userAddress.address} onChange={handleAddressChange} />
                </Form.Group>
                <Row>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>City *</Form.Label>
                            <Form.Control type="text" required name="city" value={userAddress.city} onChange={handleAddressChange} />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>PIN Code *</Form.Label>
                            <Form.Control type="text" required name="postalCode" value={userAddress.postalCode} onChange={handleAddressChange} />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Control type="text" name="country" value={userAddress.country} onChange={handleAddressChange} />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <div className="d-flex justify-content-end mt-4">
                <Button variant="dark" size="lg" className="px-5 rounded-pill" onClick={handleNextStep}>
                    Continue to Payment <FaArrowRight className="ms-2" />
                </Button>
            </div>
        </div>
    );

    // --- Step 2: Payment Method Selection ---
    const PaymentStep = () => (
        <div className="checkout-form-container">
            <h4 className="mb-4 fw-bold">Select Payment Method</h4>
            <Row className="g-3">
                {PAYMENT_METHODS.map(method => (
                    <Col md={6} key={method.id}>
                        <Card
                            className={`payment-option-card h-100 ${selectedPayment === method.id ? 'selected' : ''}`}
                            onClick={() => setSelectedPayment(method.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <Card.Body className="d-flex align-items-center p-4">
                                <div className="payment-icon-box me-3">
                                    <method.icon size={28} />
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold">{method.name}</h6>
                                    <small className="text-muted">{method.description}</small>
                                </div>
                                {selectedPayment === method.id && (
                                    <div className="ms-auto text-success">
                                        <FaCheck size={20} />
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <div className="d-flex justify-content-between mt-5">
                <Button variant="outline-dark" size="lg" className="px-4 rounded-pill" onClick={handlePrevStep}>
                    <FaArrowLeft className="me-2" /> Back
                </Button>
                <Button variant="success" size="lg" className="px-5 rounded-pill" onClick={handleSubmit} disabled={!selectedPayment}>
                    Place Order - ₹{cartTotal.toLocaleString()}
                </Button>
            </div>
        </div>
    );

    return (
        <div className="checkout-page pb-5">
            <Container>
                <h2 className="mb-4 fw-bold text-center">Checkout</h2>
                <StepIndicator />
                <Row>
                    <Col lg={7} className="mb-4">
                        {currentStep === 1 && <ShippingStep />}
                        {currentStep === 2 && <PaymentStep />}
                    </Col>

                    {/* Order Summary Sidebar */}
                    <Col lg={5}>
                        <div className="checkout-summary sticky-top" style={{ top: '100px' }}>
                            <h5 className="mb-4 fw-bold">Order Summary</h5>
                            {cartItems.map(item => (
                                <div key={item.id} className="order-item-row">
                                    <div className="d-flex align-items-center">
                                        <img src={item.image} alt={item.name} className="summary-img" />
                                        <div>
                                            <h6 className="mb-0 fw-bold">{item.name}</h6>
                                            <small className="text-muted">Qty: {item.quantity}</small>
                                        </div>
                                    </div>
                                    <span className="fw-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                            <hr />
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Subtotal</span>
                                <span>₹{cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-muted">Shipping</span>
                                <span className="text-success fw-bold">Free</span>
                            </div>
                            <div className="d-flex justify-content-between fw-bold fs-5 pt-2 border-top">
                                <span>Total</span>
                                <span>₹{cartTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Success Modal */}
            <Modal show={showSuccess} onHide={handleClose} centered backdrop="static">
                <Modal.Body className="text-center p-5">
                    <div className="mb-4 text-success">
                        <FaCheck size={60} />
                    </div>
                    <h2 className="fw-bold mb-3">Order Placed!</h2>
                    <p className="text-muted mb-4">Thank you for your purchase. Your order number is <strong>#{orderId}</strong>.</p>
                    <Button variant="dark" className="rounded-pill px-5" onClick={handleClose}>
                        Continue Shopping
                    </Button>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Checkout;
