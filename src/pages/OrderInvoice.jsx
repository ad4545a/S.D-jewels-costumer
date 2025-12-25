import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Card, Spinner, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const OrderInvoice = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`${API_URL}/orders/${id}`, {
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

    if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;
    if (error) return <p className="text-danger text-center py-5">{error}</p>;

    if (!order.isDelivered && order.orderStatus !== 'Delivered') {
        return (
            <Container className="py-5 mt-5 text-center">
                <Card className="shadow-sm border-0 p-5 mx-auto" style={{ maxWidth: '600px' }}>
                    <div className="mb-4">
                        <i className="bi bi-file-earmark-lock display-1 text-muted"></i>
                    </div>
                    <h3 className="fw-bold mb-3">Invoice Unavailable</h3>
                    <p className="text-muted mb-4">
                        The invoice for this order will be generated automatically once the order has been <strong>Delivered</strong>.
                    </p>
                    <p className="text-muted small">
                        Current Status: <span className="badge bg-warning text-dark">{order.orderStatus}</span>
                    </p>
                    <div className="mt-4">
                        <Button variant="outline-dark" onClick={() => window.history.back()}>
                            Go Back
                        </Button>
                    </div>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="py-5 mt-5">
            <Card className="shadow-lg border-0 print-optimized" style={{ borderRadius: '0' }}>
                <Card.Body className="p-0">
                    {/* Header Image/Banner Area - Simulated with CSS */}
                    <div className="invoice-banner" style={{ background: '#f8f9fa', padding: '40px', position: 'relative', overflow: 'hidden' }}>


                        <Row className="position-relative" style={{ zIndex: 2 }}>
                            <Col md={6}>
                                <div className="d-flex align-items-center mb-3">
                                    <h4 className="fw-bold m-0"><i className="bi bi-gem me-2"></i>S.D. JEWELS</h4>
                                </div>
                                <h1 className="fw-bold display-4">Invoice.</h1>
                            </Col>
                            <Col md={6} className="text-end df-flex flex-column justify-content-center">
                                <h6 className="text-danger fw-bold letter-spacing-2">JEWELRY SERVICE</h6>
                            </Col>
                        </Row>
                    </div>

                    <div className="p-5">
                        {/* Info Section */}
                        <Row className="mb-5">
                            <Col md={5}>
                                <h6 className="text-danger fw-bold text-uppercase mb-2">BILLED TO</h6>
                                <h2 className="fw-bold mb-3">{order.user.name}</h2>
                                <p className="mb-1"><strong>Contact Person.</strong></p>
                                <p className="mb-0">Email : {order.user.email}</p>
                                <p className="mb-0">Address : {order.shippingAddress.address}, {order.shippingAddress.city}</p>
                            </Col>
                            <Col md={7}>
                                <Row>
                                    <Col md={6}>
                                        <p className="mb-1"><strong>Invoice No</strong> : #{order.orderId.substring(4)}</p>
                                        <p className="mb-4"><strong>Invoice Date</strong> : {order.createdAt.substring(0, 10)}</p>
                                    </Col>
                                    <Col md={6}>
                                        <p className="mb-1"><strong>Payment Method.</strong></p>
                                        <p className="mb-0">Method : {order.paymentMethod}</p>
                                        <p className={order.isPaid ? "text-success fw-bold" : "text-danger fw-bold"}>
                                            {order.isPaid ? "Status : PAID" : "Status : DUE"}
                                        </p>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        {/* Table */}
                        <div className="table-responsive mb-4">
                            <Table borderless style={{ verticalAlign: 'middle' }}>
                                <thead className="bg-danger text-white">
                                    <tr>
                                        <th className="py-3 ps-4">No.</th>
                                        <th className="py-3">Description</th>
                                        <th className="py-3 text-end">Price</th>
                                        <th className="py-3 text-center">Qty</th>
                                        <th className="py-3 text-end pe-4">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.orderItems.map((item, index) => (
                                        <tr key={index} className="border-bottom">
                                            <td className="ps-4 py-3">{index + 1}</td>
                                            <td className="py-3">{item.name}</td>
                                            <td className="text-end py-3">${(item.price || 0).toLocaleString()}</td>
                                            <td className="text-center py-3">{item.qty}</td>
                                            <td className="text-end pe-4 py-3">${((item.price || 0) * (item.qty || 1)).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>

                        {/* Footer Totals */}
                        <Row>
                            <Col md={6}>
                                <div className="mt-4">
                                    <h6 className="fw-bold">Total Due</h6>
                                    <h1 className="text-danger fw-bold display-5">${(order.totalPrice || 0).toLocaleString()} <span className="fs-6 text-muted">USD</span></h1>
                                </div>

                                <div className="mt-5 pt-3">
                                    <h6 className="fw-bold border-bottom pb-2 d-inline-block">Term & Conditions.</h6>
                                    <p className="text-muted small mt-2" style={{ maxWidth: '300px' }}>
                                        Please send payment within 30 days of receiving this invoice.
                                    </p>
                                </div>
                            </Col>
                            <Col md={{ span: 5, offset: 1 }}>
                                <Table borderless size="sm">
                                    <tbody>
                                        <tr>
                                            <td className="py-2">Sub Total</td>
                                            <td className="text-end fw-bold py-2">${(order.itemsPrice || 0).toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2">Tax (10%)</td>
                                            <td className="text-end fw-bold py-2">${(order.taxPrice || 0).toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2">Shipping</td>
                                            <td className="text-end fw-bold py-2">${(order.shippingPrice || 0).toLocaleString()}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <div className="bg-danger text-white p-3 d-flex justify-content-between align-items-center mt-2" style={{ borderRadius: '4px' }}>
                                    <span className="fw-bold h5 mb-0">TOTAL</span>
                                    <span className="fw-bold h5 mb-0">${(order.totalPrice || 0).toLocaleString()}</span>
                                </div>

                                <div className="text-end mt-5">
                                    {/* Simulated Signature */}
                                    <div style={{ fontFamily: 'cursive', fontSize: '1.5rem', color: '#555' }}>Aditya D</div>
                                    <div className="border-top w-50 ms-auto mt-2 pt-1">
                                        <small className="fw-bold">Manager</small>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        {/* Bottom Bar */}
                        <div className="border-top mt-5 pt-4 text-muted small d-flex justify-content-between">
                            <span>P. (+1) 234 567 890</span>
                            <span>A. 123 Jewelry Lane, NY</span>
                            <span>E. support@sdjewels.com</span>
                        </div>
                    </div>

                    {/* Print Button Wrapper */}
                    <div className="p-4 bg-light text-end no-print">
                        <Button variant="dark" onClick={() => window.print()}>
                            <i className="bi bi-printer me-2"></i> Print Invoice
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default OrderInvoice;
