import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Badge } from 'react-bootstrap';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import './Profile.css';
import { API_URL } from '../config';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Set initial tab from navigation state or default to 'details'
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'details');

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Render Components based on activeTab
    const renderContent = () => {
        switch (activeTab) {
            case 'details':
                return <PersonalDetails user={user} />;
            case 'address':
                return <AddressBook />;
            case 'payment':
                return <PaymentMethods />;
            case 'orders':
                return <OrderHistory />;
            case 'wishlist':
                return <WishlistGrid />;
            default:
                return <PersonalDetails user={user} />;
        }
    };

    return (
        <div className="profile-page pb-5">
            <Container>
                <h2 className="mb-4 fw-bold">My Account</h2>
                <Row>
                    {/* Sidebar */}
                    <Col lg={3} md={4} className="mb-4">
                        <div className="profile-sidebar-card">
                            <img src={user.avatar} alt="Avatar" className="profile-avatar" />
                            <h5 className="fw-bold mb-0">{user.name}</h5>
                            <p className="text-muted small mb-4">{user.email}</p>

                            <div className="text-start">
                                <button
                                    className={`profile-nav-btn ${activeTab === 'details' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('details')}
                                >
                                    <i className="bi bi-person"></i> Personal Details
                                </button>
                                <button
                                    className={`profile-nav-btn ${activeTab === 'address' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('address')}
                                >
                                    <i className="bi bi-geo-alt"></i> Address Book
                                </button>
                                <button
                                    className={`profile-nav-btn ${activeTab === 'payment' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('payment')}
                                >
                                    <i className="bi bi-credit-card"></i> Payment Methods
                                </button>
                                <button
                                    className={`profile-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('orders')}
                                >
                                    <i className="bi bi-box-seam"></i> Order History
                                </button>
                                <button
                                    className={`profile-nav-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('wishlist')}
                                >
                                    <i className="bi bi-heart"></i> Wishlist
                                </button>

                                <button className="profile-nav-btn logout-btn" onClick={handleLogout}>
                                    <i className="bi bi-box-arrow-right"></i> Logout
                                </button>
                            </div>
                        </div>
                    </Col>

                    {/* Content Area */}
                    <Col lg={9} md={8}>
                        <div className="dashboard-content">
                            {renderContent()}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

// Sub-components for better organization

const PersonalDetails = ({ user }) => (
    <div>
        <div className="section-header">
            <h4 className="fw-bold">Personal Details</h4>
            <p className="text-muted small mb-0">Update your personal information here.</p>
        </div>
        <Form>
            <Row>
                <Col md={6} className="mb-3">
                    <Form.Group>
                        <Form.Label className="form-label-bold">Full Name</Form.Label>
                        <Form.Control type="text" defaultValue={user.name} className="profile-form-control" />
                    </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                    <Form.Group>
                        <Form.Label className="form-label-bold">Phone Number</Form.Label>
                        <Form.Control type="tel" placeholder="+1 (555) 000-0000" className="profile-form-control" />
                    </Form.Group>
                </Col>
                <Col md={12} className="mb-3">
                    <Form.Group>
                        <Form.Label className="form-label-bold">Email Address</Form.Label>
                        <Form.Control type="email" defaultValue={user.email} disabled className="profile-form-control bg-light" />
                        <Form.Text className="text-muted">Email cannot be changed.</Form.Text>
                    </Form.Group>
                </Col>
            </Row>
            <Button variant="dark" className="rounded-pill px-4 mt-2">Save Changes</Button>
        </Form>
    </div>
);

const AddressBook = () => (
    <div>
        <div className="section-header d-flex justify-content-between align-items-center">
            <div>
                <h4 className="fw-bold">Address Book</h4>
                <p className="text-muted small mb-0">Manage your shipping and billing addresses.</p>
            </div>
            <Button variant="outline-dark" size="sm" className="rounded-pill"><i className="bi bi-plus-lg me-1"></i> Add New</Button>
        </div>
        <Row>
            <Col md={6} className="mb-4">
                <div className="address-card filled p-4">
                    <Badge bg="dark" className="mb-3">Default Shipping</Badge>
                    <h6 className="fw-bold">Home</h6>
                    <p className="text-muted small mb-2">
                        123 Jewel Lane, Apt 4B<br />
                        New York, NY 10012<br />
                        United States
                    </p>
                    <div className="mt-3">
                        <Button variant="link" className="p-0 text-dark me-3 small text-decoration-none fw-bold">Edit</Button>
                        <Button variant="link" className="p-0 text-danger small text-decoration-none fw-bold">Remove</Button>
                    </div>
                </div>
            </Col>
            <Col md={6} className="mb-4">
                <div className="address-card">
                    <i className="bi bi-plus-circle fs-3 text-muted mb-2"></i>
                    <span className="text-muted fw-bold">Add New Address</span>
                </div>
            </Col>
        </Row>
    </div>
);

const PaymentMethods = () => (
    <div>
        <div className="section-header">
            <h4 className="fw-bold">Payment Methods</h4>
            <p className="text-muted small mb-0">Securely manage your saved payment options.</p>
        </div>
        <Row>
            <Col md={6} className="mb-4">
                <div className="address-card filled p-4" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)', color: 'white', borderColor: 'transparent' }}>
                    <div className="d-flex justify-content-between w-100 mb-4">
                        <i className="bi bi-credit-card-2-front fs-4"></i>
                        <span className="text-white-50">VISA</span>
                    </div>
                    <h5 className="mb-4" style={{ letterSpacing: '2px' }}>•••• •••• •••• 4242</h5>
                    <div className="d-flex justify-content-between w-100">
                        <small className="text-white-50">Card Holder<br /><span className="text-white">Aditya D</span></small>
                        <small className="text-white-50">Expires<br /><span className="text-white">12/28</span></small>
                    </div>
                </div>
            </Col>
            <Col md={6} className="mb-4">
                <div className="address-card">
                    <i className="bi bi-plus-circle fs-3 text-muted mb-2"></i>
                    <span className="text-muted fw-bold">Add New Card</span>
                </div>
            </Col>
        </Row>
    </div>
);

const OrderHistory = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState(null);


    React.useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${API_URL}/orders/myorders`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const data = await res.json();
                if (res.ok) {
                    setOrders(data);
                } else {
                    throw new Error(data.message || 'Failed to fetch orders');
                }
            } catch (err) {
                setError(err.message);
                // Fallback to empty if fails
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.token) {
            fetchOrders();
        }
    }, [user]);

    if (loading) return <div className="text-center py-5">Loading Orders...</div>;

    if (orders.length === 0) {
        return (
            <div className="text-center py-5">
                <div className="mb-3">
                    <i className="bi bi-bag-x fs-1 text-muted"></i>
                </div>
                <h5 className="fw-bold">No Orders Yet</h5>
                <p className="text-muted">Looks like you haven't placed an order yet.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="section-header">
                <h4 className="fw-bold">Order History</h4>
                <p className="text-muted small mb-0">Track and view your recent purchases.</p>
            </div>
            {orders.map(order => (
                <div key={order._id} className="order-card">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <h6 className="fw-bold mb-1">Order #{order._id.substring(0, 8)}...</h6>
                            <p className="text-muted small mb-0">Placed on {order.createdAt.substring(0, 10)}</p>
                        </div>

                        <span className={`status-badge ${order.orderStatus === 'Delivered' ? 'status-delivered' :
                            order.orderStatus === 'Cancelled' ? 'bg-danger text-white' :
                                'status-processing'
                            }`}>
                            {order.orderStatus}
                        </span>
                    </div>

                    <div className="bg-light p-3 rounded-3 mb-3">
                        <small className="text-muted d-block mb-1">Items:</small>
                        {order.orderItems.map((item, idx) => (
                            <span key={idx} className="me-3 fw-medium text-dark">
                                <i className="bi bi-dot"></i> {item.name} (x{item.qty})
                            </span>
                        ))}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                        <span className="fw-bold">Total: ${order.totalPrice.toLocaleString()}</span>
                        <div>
                            <Link to={`/order/${order._id}`}>
                                <Button variant="outline-dark" size="sm" className="rounded-pill me-2">Track Order</Button>
                            </Link>
                            {order.isDelivered || order.orderStatus === 'Delivered' ? (
                                <Link to={`/order/${order._id}/invoice`}>
                                    <Button variant="link" className="text-muted text-decoration-none small">View Invoice</Button>
                                </Link>
                            ) : (
                                <Button variant="link" disabled className="text-muted text-decoration-none small opacity-50" title="Available after delivery">Invoice Locked</Button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const WishlistGrid = () => {
    const { wishlist } = useWishlist();

    if (wishlist.length === 0) {
        return (
            <div className="text-center py-5">
                <i className="bi bi-heart fs-1 text-muted mb-3 d-block"></i>
                <h5 className="fw-bold">Your Wishlist is Empty</h5>
                <p className="text-muted">Save items you love to view them here.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="section-header">
                <h4 className="fw-bold">My Wishlist</h4>
                <p className="text-muted small mb-0">{wishlist.length} saved items</p>
            </div>
            <Row>
                {wishlist.map(product => (
                    <Col md={4} sm={6} xs={12} key={product.id} className="mb-4">
                        <ProductCard {...product} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Profile;
