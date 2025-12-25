import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleAddToCart = (product) => {
        addToCart(product);
        removeFromWishlist(product.id);
    };

    if (wishlist.length === 0) {
        return (
            <Container className="py-5 mt-5 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <i className="bi bi-heart text-muted mb-4" style={{ fontSize: '4rem' }}></i>
                <h2 className="mb-3">Your Wishlist is Empty</h2>
                <p className="text-muted mb-4">Looks like you haven't added any items to your wishlist yet.</p>
                <Link to="/shop">
                    <Button variant="dark" className="px-4 py-2 rounded-pill text-uppercase" style={{ letterSpacing: '2px' }}>
                        Start Shopping
                    </Button>
                </Link>
            </Container>
        );
    }

    return (
        <Container className="py-5 mt-5">
            <h2 className="text-center mb-5 fw-bold" style={{ fontFamily: 'Playfair Display, serif' }}>MY WISHLIST</h2>
            <Row xs={1} md={2} lg={4} className="g-4">
                {wishlist.map((item) => (
                    <Col key={item.id}>
                        <Card className="h-100 border-0 shadow-sm product-card">
                            <div className="position-relative overflow-hidden">
                                <Link to={`/product/${item.id}`}>
                                    <Card.Img variant="top" src={item.image} alt={item.name} style={{ height: '300px', objectFit: 'cover' }} />
                                </Link>
                                <Button
                                    variant="light"
                                    className="position-absolute top-0 end-0 m-2 rounded-circle shadow-sm"
                                    onClick={() => removeFromWishlist(item.id)}
                                    title="Remove from Wishlist"
                                    style={{ width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <i className="bi bi-x-lg text-danger" style={{ fontSize: '0.9rem' }}></i>
                                </Button>
                            </div>
                            <Card.Body className="text-center">
                                <Link to={`/product/${item.id}`} className="text-decoration-none text-dark">
                                    <Card.Title className="fw-bold mb-2" style={{ fontSize: '1rem' }}>{item.name}</Card.Title>
                                </Link>
                                <Card.Text className="text-muted mb-3">${item.price}</Card.Text>
                                <Button
                                    variant="outline-dark"
                                    className="w-100 rounded-0 text-uppercase"
                                    onClick={() => handleAddToCart(item)}
                                    style={{ letterSpacing: '1px', fontSize: '0.8rem' }}
                                >
                                    Add to Cart
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Wishlist;
