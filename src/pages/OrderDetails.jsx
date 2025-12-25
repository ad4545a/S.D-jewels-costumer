import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Image, Badge, Spinner, Button, Modal, Toast, ToastContainer } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';

const TrackOrder = ({ status, isDelivered }) => {
    const steps = ['Processing', 'Accepted', 'Shipped', 'Delivered'];

    // Determine current step index
    let currentStep = 0;
    if (status === 'Accepted') currentStep = 1;
    if (status === 'Shipped') currentStep = 2;
    if (status === 'Delivered' || isDelivered) currentStep = 3;
    if (status === 'Cancelled') currentStep = -1;

    return (
        <div className="track-order my-5">
            {status === 'Cancelled' ? (
                <div className="alert alert-danger text-center">
                    <h4>Order Cancelled</h4>
                    <p>This order has been cancelled.</p>
                </div>
            ) : (
                <div className="d-flex justify-content-between position-relative align-items-center">
                    {/* Progress Bar Background */}
                    <div className="position-absolute" style={{ top: '50%', left: '0', right: '0', height: '4px', backgroundColor: '#e9ecef', zIndex: 0, transform: 'translateY(-50%)' }}></div>

                    {/* Active Progress Bar */}
                    <div className="position-absolute" style={{
                        top: '50%',
                        left: '0',
                        height: '4px',
                        backgroundColor: '#28a745',
                        zIndex: 0,
                        transform: 'translateY(-50%)',
                        width: `${(currentStep / (steps.length - 1)) * 100}%`,
                        transition: 'width 0.5s ease'
                    }}></div>

                    {steps.map((step, index) => {
                        const isCompleted = index <= currentStep;
                        const isCurrent = index === currentStep;

                        return (
                            <div key={step} className="text-center position-relative" style={{ zIndex: 1, flex: 1 }}>
                                <div
                                    className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${isCompleted ? 'bg-success text-white' : 'bg-white border text-muted'}`}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        border: isCompleted ? 'none' : '2px solid #e9ecef',
                                        transition: 'all 0.3s ease',
                                        boxShadow: isCurrent ? '0 0 0 5px rgba(40, 167, 69, 0.2)' : 'none'
                                    }}
                                >
                                    {index === 0 && <i className="bi bi-clipboard-data"></i>}
                                    {index === 1 && <i className="bi bi-box-seam"></i>}
                                    {index === 2 && <i className="bi bi-truck"></i>}
                                    {index === 3 && <i className="bi bi-check-lg"></i>}
                                </div>
                                <small className={`fw-bold ${isCompleted ? 'text-success' : 'text-muted'}`}>{step}</small>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const OrderDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // UI State for Modals and Toasts
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({ title: '', body: '', action: null });
    const [showToast, setShowToast] = useState(false);
    const [toastConfig, setToastConfig] = useState({ variant: 'success', message: '' });

    // Socket.IO Listener
    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('order_updated', (updatedOrder) => {
            if (updatedOrder._id === id) {
                setOrder(updatedOrder);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [id]);

    const showNotification = (variant, message) => {
        setToastConfig({ variant, message });
        setShowToast(true);
    };

    const handleActionClick = (type) => {
        if (type === 'cancel') {
            setModalData({
                title: 'Cancel Order',
                body: 'Are you sure you want to cancel this order? This action cannot be undone.',
                action: executeCancelOrder
            });
        } else if (type === 'return') {
            setModalData({
                title: 'Return Order',
                body: 'Are you sure you want to return this order?',
                action: executeReturnOrder
            });
        }
        setShowModal(true);
    };

    const confirmAction = () => {
        if (modalData.action) {
            modalData.action();
        }
        setShowModal(false);
    };

    const executeCancelOrder = async () => {
        setActionLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/orders/${order._id}/cancel`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                const updatedOrder = await res.json();
                setOrder(updatedOrder);
                showNotification('success', 'Order Cancelled Successfully');
            } else {
                showNotification('danger', 'Failed to cancel order');
            }
        } catch (err) {
            showNotification('danger', 'Error cancelling order');
        } finally {
            setActionLoading(false);
        }
    };

    const executeReturnOrder = async () => {
        setActionLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/orders/${order._id}/return`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                const updatedOrder = await res.json();
                setOrder(updatedOrder);
                showNotification('success', 'Return Request Submitted');
            } else {
                showNotification('danger', 'Failed to return order');
            }
        } catch (err) {
            showNotification('danger', 'Error returning order');
        } finally {
            setActionLoading(false);
        }
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const data = await res.json();
                if (res.ok) {
                    setOrder(data);
                } else {
                    setError(data.message || 'Failed to fetch order');
                }
            } catch (err) {
                setError('Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrder();
        }
    }, [id, user]);

    return (
        <Container className="py-5 mt-5 pt-5">
            {/* Toast Notification */}
            <ToastContainer position="top-center" className="p-3" style={{ zIndex: 1050, position: 'fixed', marginTop: '20px' }}>
                <Toast
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={3000}
                    autohide
                    bg={toastConfig.variant}
                    className="modern-toast text-white"
                >
                    <Toast.Body className="d-flex align-items-center justify-content-center">
                        <strong className="me-2 text-uppercase" style={{ letterSpacing: '1px' }}>Notification:</strong>
                        {toastConfig.message}
                    </Toast.Body>
                </Toast>
            </ToastContainer>

            {/* Confirmation Modal */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                dialogClassName="modern-modal"
                backdrop="static"
            >
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="w-100 text-center text-uppercase fs-5" style={{ letterSpacing: '1px' }}>
                        {modalData.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    <div className="mb-3">
                        {modalData.title.includes('Cancel') ? (
                            <i className="bi bi-x-circle text-danger" style={{ fontSize: '3rem' }}></i>
                        ) : (
                            <i className="bi bi-arrow-return-left text-dark" style={{ fontSize: '3rem' }}></i>
                        )}
                    </div>
                    {modalData.body}
                </Modal.Body>
                <Modal.Footer className="justify-content-center border-0 pb-4">
                    <Button variant="light" onClick={() => setShowModal(false)} className="modern-btn-secondary px-4 me-3">
                        No, Keep Order
                    </Button>
                    <Button variant="danger" onClick={confirmAction} className="modern-btn-danger px-4">
                        Yes, Proceed
                    </Button>
                </Modal.Footer>
            </Modal>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <>
                    <h2 className="mb-4">Order Invoice {order.orderId}</h2>

                    {/* Track Order Component */}
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <h5 className="mb-4">Order Status</h5>
                            <TrackOrder status={order.orderStatus} isDelivered={order.isDelivered} />
                        </Card.Body>
                    </Card>

                    <Row>
                        <Col md={8}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h3>Shipping</h3>
                                    <p>
                                        <strong>Name: </strong> {order.user.name} <br />
                                        <strong>Email: </strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a> <br />
                                        <strong>Address: </strong>
                                        {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                                        {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                    </p>
                                    {order.isDelivered ? (
                                        <Badge bg="success">Delivered on {order.deliveredAt ? order.deliveredAt.substring(0, 10) : ''}</Badge>
                                    ) : (
                                        <Badge bg="warning" text="dark">Not Delivered</Badge>
                                    )}
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <h3>Payment Method</h3>
                                    <p>
                                        <strong>Method: </strong> {order.paymentMethod}
                                    </p>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <h3>Order Items</h3>
                                    {order.orderItems.length === 0 ? (
                                        <p>Order is empty</p>
                                    ) : (
                                        <ListGroup variant="flush">
                                            {order.orderItems.map((item, index) => (
                                                <ListGroup.Item key={index}>
                                                    <Row>
                                                        <Col md={2}>
                                                            <Image src={item.image} alt={item.name} fluid rounded />
                                                        </Col>
                                                        <Col>
                                                            <Link to={`/product/${item.product}`}>
                                                                {item.name}
                                                            </Link>
                                                        </Col>
                                                        <Col md={4}>
                                                            {item.qty} x ${item.price} = ${item.qty * item.price}
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={4}>
                            <Card className="shadow-sm border-0">
                                <Card.Body>
                                    <h5 className="fw-bold mb-3">Actions</h5>
                                    <div className="d-grid gap-2">
                                        {order.isDelivered || order.orderStatus === 'Delivered' ? (
                                            <Link to={`/order/${order._id}/invoice`} className="btn btn-outline-dark">
                                                <i className="bi bi-receipt me-2"></i> View Invoice
                                            </Link>
                                        ) : (
                                            <Button variant="outline-dark" disabled className="opacity-50">
                                                <i className="bi bi-lock me-2"></i> Invoice Locked
                                            </Button>
                                        )}


                                        {/* Dynamic Cancel/Return Button */}
                                        <div className="mt-3 pt-3 border-top">
                                            {order.orderStatus === 'Cancelled' ? (
                                                <div className="text-center text-danger fw-bold border p-2 rounded bg-light">
                                                    Order Cancelled
                                                </div>
                                            ) : order.orderStatus === 'Returned' ? (
                                                <div className="text-center text-warning fw-bold border p-2 rounded bg-light">
                                                    Order Returned
                                                </div>
                                            ) : (
                                                <div className="d-grid gap-2">
                                                    {/* Cancel Button - Hidden if Delivered */}
                                                    {order.orderStatus !== 'Delivered' && !order.isDelivered && (
                                                        <Button
                                                            variant="outline-danger"
                                                            onClick={() => handleActionClick('cancel')}
                                                            disabled={actionLoading || order.orderStatus === 'Shipped'}
                                                            className="w-100"
                                                        >
                                                            {order.orderStatus === 'Shipped' ? 'Cancel Order (Shipped)' : (actionLoading ? 'Cancelling...' : 'Cancel Order')}
                                                        </Button>
                                                    )}

                                                    {/* Return Button - Visible but Disabled if not Delivered */}
                                                    <Button
                                                        variant={order.orderStatus === 'Delivered' || order.isDelivered ? "outline-dark" : "outline-secondary"}
                                                        onClick={() => handleActionClick('return')}
                                                        className="w-100"
                                                        disabled={actionLoading || (order.orderStatus !== 'Delivered' && !order.isDelivered)}
                                                        title={order.orderStatus !== 'Delivered' ? "Available after delivery" : ""}
                                                    >
                                                        {actionLoading && (order.orderStatus === 'Delivered' || order.isDelivered) ? 'Processing...' : 'Return Order'}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

export default OrderDetails;
