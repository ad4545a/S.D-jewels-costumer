import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Tab, Tabs, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [activeImg, setActiveImg] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!product) return;

        const fetchSimilar = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/products');
                const data = await res.json();

                if (res.ok) {
                    // Filter same category
                    const sameCategory = data.filter(p =>
                        p._id !== product._id &&
                        p._id !== product.id &&
                        p.category.some(c => product.category.includes(c))
                    );

                    if (sameCategory.length > 0) {
                        setSimilarProducts(sameCategory.slice(0, 3));
                    } else {
                        // Fallback to any other products
                        const others = data.filter(p => p._id !== product._id && p._id !== product.id);
                        setSimilarProducts(others.slice(0, 3));
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
        fetchSimilar();
    }, [product]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);



    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // If id is not present or is a mock ID (small number), we might want to handle differently
                // But for now, let's try to fetch.
                const res = await fetch(`http://localhost:5000/api/products/${id}`);
                const data = await res.json();

                if (res.ok) {
                    // Normalize images
                    if (!data.images || data.images.length === 0) {
                        data.images = [data.image];
                    }
                    setProduct(data);
                } else {
                    throw new Error(data.message || 'Product not found');
                }
            } catch (err) {
                setError(err.message);
                console.error("Fetch details error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <div className="text-center py-5">Loading Details...</div>;
    if (error || !product) return <div className="text-center py-5">Product not found</div>;

    const handleAddToCart = () => {
        addToCart({
            id: product._id || product.id,
            name: product.name,
            price: product.price,
            image: product.image || (product.images && product.images[0])
        }, Number(quantity));
        // Optional: Show toast notification?
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/cart');
    };



    return (
        <div className="product-details-page pb-5">
            <Container>
                <div className="mb-4">
                    <Button variant="link" className="text-decoration-none text-muted p-0" onClick={() => navigate(-1)}>
                        <i className="bi bi-arrow-left me-2"></i>Back to Shopping
                    </Button>
                </div>
                <Row className="mb-5">
                    {/* Image Gallery */}
                    <Col md={6} className="mb-4">
                        <div className="gallery-container p-4 text-center">
                            <img src={product.images[activeImg]} alt={product.name} className="main-image" />
                        </div>
                        <div className="thumbnails">
                            {product.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt="thumb"
                                    className={`thumb-img ${activeImg === idx ? 'active' : ''}`}
                                    onClick={() => setActiveImg(idx)}
                                />
                            ))}
                        </div>
                    </Col>

                    {/* Product Info */}
                    <Col md={6}>
                        <div className="product-info-section ps-md-4">
                            <div className="d-flex align-items-center mb-2">
                                <span className="text-muted small text-uppercase me-2">Jewelry / Rings</span>
                            </div>
                            <h1 className="fw-bold">{product.name}</h1>

                            <div className="rating-badge mb-3">
                                <i className="bi bi-star-fill text-warning me-1"></i>
                                <strong>{product.rating}</strong>
                                <span className="text-muted ms-1">({product.reviews} Reviews)</span>
                            </div>

                            <p className="price-tag mb-4">${product.price.toLocaleString()}</p>

                            <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
                                {product.description}
                            </p>

                            <div className="buy-box">
                                <Form.Group className="mb-3 d-flex align-items-center">
                                    <Form.Label className="me-3 mb-0 fw-bold">Quantity:</Form.Label>
                                    <Form.Select style={{ width: '80px' }} value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </Form.Select>
                                </Form.Group>
                                <div className="d-grid gap-2">
                                    <Button className="btn-buy-now" onClick={handleBuyNow}>Buy Now</Button>
                                    <Button variant="outline-dark" className="btn-add-cart" onClick={handleAddToCart}>Add to Cart</Button>
                                </div>
                                <div className="mt-3 text-muted small text-center">
                                    <i className="bi bi-shield-check me-1"></i> Secure Transaction
                                </div>
                            </div>

                            <div className="mt-4">
                                <ul className="list-unstyled text-muted small">
                                    <li className="mb-1"><i className="bi bi-check-circle me-2 text-success"></i>In Stock & Ready to Ship</li>
                                    <li className="mb-1"><i className="bi bi-check-circle me-2 text-success"></i>Free Delivery Available</li>
                                </ul>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Tabs: Description & Reviews */}
                <Row className="mb-5">
                    <Col>
                        <Tabs defaultActiveKey="desc" id="product-tabs" className="mb-4 border-bottom">
                            <Tab eventKey="desc" title="Description">
                                <div className="p-3">
                                    <h4>Product Details</h4>
                                    <p className="text-muted">
                                        {product.description}
                                    </p>
                                    {product.productDetails && (
                                        <ul className="text-muted">
                                            {product.weight && <li>Weight: {product.weight}</li>}
                                            {product.carat && <li>Carat: {product.carat}</li>}
                                            {product.productDetails.split(/,|\n/).map((detail, index) => (
                                                <li key={index}>{detail.trim()}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </Tab>
                            <Tab eventKey="reviews" title={`Reviews (${product.reviews})`}>
                                <div className="p-3">
                                    <div className="review-item">
                                        <div className="d-flex justify-content-between">
                                            <h6 className="fw-bold">Sarah J.</h6>
                                            <small className="text-muted">2 days ago</small>
                                        </div>
                                        <div className="text-warning mb-2"><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i></div>
                                        <p className="text-muted small">Absolutely stunning ring! The sparkle is incredible.</p>
                                    </div>
                                    <div className="review-item">
                                        <div className="d-flex justify-content-between">
                                            <h6 className="fw-bold">Mike T.</h6>
                                            <small className="text-muted">1 week ago</small>
                                        </div>
                                        <div className="text-warning mb-2"><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i></div>
                                        <p className="text-muted small">Great quality, but shipping took a day longer than expected.</p>
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>

                {/* Similar Products */}
                <div className="similar-section px-4">
                    <h3 className="mb-4 text-center">You May Also Like</h3>
                    <Row>
                        {similarProducts.map(prod => (
                            <Col md={4} key={prod.id} className="mb-3">
                                {/* Wrap in Link is handled in ProductCard Logic if passed locally or specific Link wrapper here */}
                                <ProductCard {...prod} />
                            </Col>
                        ))}
                    </Row>
                </div>

            </Container>
        </div>
    );
};

export default ProductDetails;
