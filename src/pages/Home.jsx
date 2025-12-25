import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStar, FaFire } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
    // Use a model image similar to the reference
    const heroImage = "/images/hero-image.png"; // Elegant model with jewelry

    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);
    const [recommended, setRecommended] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch featured products
                const res = await fetch('http://localhost:5000/api/products');
                const data = await res.json();
                if (res.ok) {
                    setFeaturedProducts(data.slice(0, 4));
                }

                // Fetch analytics data
                const analyticsRes = await fetch('http://localhost:5000/api/products/analytics/featured');
                const analyticsData = await analyticsRes.json();
                if (analyticsRes.ok) {
                    setBestSellers(analyticsData.bestSellers?.slice(0, 4) || []);
                    setRecommended(analyticsData.recommended?.slice(0, 4) || []);
                }
            } catch (error) {
                console.error("Failed to fetch products for home", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="circle-deco"></div>
                <Container>
                    <Row className="align-items-center">
                        <Col md={{ span: 6, order: 2 }} className="position-relative">
                            <div className="hero-text-content ms-md-5">
                                <h1 className="hero-title">Glamorous & <br />Elegant Gemstone <br />Jewelry</h1>
                                <p className="lead mb-4 text-muted">Discover our elite range of fine shimmering gold and diamonds.</p>
                                <Link to="/shop">
                                    <Button variant="pill-black" size="lg">Shop Now</Button>
                                </Link>
                            </div>
                        </Col>
                        <Col md={{ span: 6, order: 1 }}>
                            <div className="hero-image-container">
                                <img src={heroImage} alt="Model" className="hero-model-img shadow-lg" />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Best Sellers Section */}
            <section className="py-5 my-5 bg-light">
                <Container>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h3 className="text-uppercase text-muted small mb-1">
                                <FaFire className="text-danger me-2" />Trending Now
                            </h3>
                            <h2 className="display-6 fw-bold">Best Sellers</h2>
                        </div>
                        <Link to="/shop" className="btn btn-outline-dark rounded-pill px-4">View All</Link>
                    </div>
                    <Row className="g-4">
                        {loading ? (
                            <h4 className="text-muted text-center">Loading...</h4>
                        ) : bestSellers.length > 0 ? (
                            bestSellers.map(product => (
                                <Col xs={6} md={3} key={product._id} className="mb-4">
                                    <ProductCard {...product} id={product._id} />
                                </Col>
                            ))
                        ) : (
                            featuredProducts.map(product => (
                                <Col xs={6} md={3} key={product.id || product._id} className="mb-4">
                                    <ProductCard {...product} id={product.id || product._id} />
                                </Col>
                            ))
                        )}
                    </Row>
                </Container>
            </section>

            {/* Featured Collection */}
            <section className="py-5 my-5">
                <Container>
                    <div className="section-title-modern">
                        <div className="line"></div>
                        <h3>Elite Range</h3>
                        <h2 className="display-4 fw-bold">Fine Crafted <br />Shimmering Gold</h2>
                    </div>
                    <Row className="g-4">
                        {loading ? (
                            <h4 className="text-muted text-center">Loading...</h4>
                        ) : featuredProducts.length > 0 ? (
                            featuredProducts.map(product => (
                                <Col xs={6} md={3} key={product.id || product._id} className="mb-4">
                                    <ProductCard {...product} id={product.id || product._id} />
                                </Col>
                            ))
                        ) : (
                            <div className="text-center w-100">
                                <h4 className="text-muted">No products found.</h4>
                            </div>
                        )}
                    </Row>
                </Container>
            </section>

            {/* Recommended Section */}
            <section className="py-5 my-5 bg-light">
                <Container>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h3 className="text-uppercase text-muted small mb-1">
                                <FaStar className="text-warning me-2" />Top Rated
                            </h3>
                            <h2 className="display-6 fw-bold">Recommended For You</h2>
                        </div>
                        <Link to="/shop" className="btn btn-outline-dark rounded-pill px-4">View All</Link>
                    </div>
                    <Row className="g-4">
                        {loading ? (
                            <h4 className="text-muted text-center">Loading...</h4>
                        ) : recommended.length > 0 ? (
                            recommended.map(product => (
                                <Col xs={6} md={3} key={product._id} className="mb-4">
                                    <ProductCard {...product} id={product._id} />
                                </Col>
                            ))
                        ) : (
                            featuredProducts.map(product => (
                                <Col xs={6} md={3} key={product.id || product._id} className="mb-4">
                                    <ProductCard {...product} id={product.id || product._id} />
                                </Col>
                            ))
                        )}
                    </Row>
                </Container>
            </section>

            {/* Newsletter / Footer Preview */}
            <section className="py-5 my-5 bg-pastel">
                <Container className="text-center py-5">
                    <h2 className="mb-4 display-5">Stay Inspired</h2>
                    <p className="mb-4 text-muted mx-auto" style={{ maxWidth: '600px' }}>Join our mailing list for exclusive offers and updates.</p>
                    <div className="d-inline-block position-relative">
                        <input type="email" placeholder="Your Email Address" className="form-control rounded-pill px-4 py-3" style={{ minWidth: '350px', paddingRight: '120px' }} />
                        <Button variant="dark" className="rounded-pill position-absolute top-0 end-0 m-1 px-4 py-2" style={{ height: 'calc(100% - 8px)' }}>Subscribe</Button>
                    </div>
                </Container>
            </section>
        </div>
    );
};

export default Home;

