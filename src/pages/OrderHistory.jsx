import React, { useEffect, useState } from 'react';
import { Container, Table, Badge, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OrderHistory = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/orders/myorders', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const data = await res.json();
                if (res.ok) {
                    setOrders(data);
                } else {
                    setError(data.message || 'Failed to fetch orders');
                }
            } catch (err) {
                setError('Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    return (
        <Container className="py-5">
            <h2 className="mb-4">My Orders</h2>
            {loading ? (
                <Spinner animation="border" />
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : orders.length === 0 ? (
                <p>You have no orders yet.</p>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ORDER ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>STATUS</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order.orderId || order._id}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>${order.totalPrice}</td>
                                <td>
                                    <Badge
                                        bg={
                                            order.orderStatus === 'Delivered'
                                                ? 'success'
                                                : order.orderStatus === 'Shipped'
                                                    ? 'info'
                                                    : order.orderStatus === 'Accepted'
                                                        ? 'primary'
                                                        : order.orderStatus === 'Cancelled'
                                                            ? 'danger'
                                                            : 'warning'
                                        }
                                    >
                                        {order.orderStatus}
                                    </Badge>
                                </td>
                                <td>
                                    <Link to={`/order/${order._id}`}>
                                        <Button variant="light" size="sm">
                                            Details
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default OrderHistory;
