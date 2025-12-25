import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './About.css';

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="about-page">
            {/* Hero Section */}
            <div className="about-hero text-center">
                <Container>
                    <small className="text-uppercase ls-2 text-muted fw-bold">Since 1995</small>
                    <h1 className="about-title display-3 fw-bold">The Art of Elegance</h1>
                    <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
                        Crafting timeless pieces that celebrate life's most precious moments.
                        Where tradition meets modern artistry.
                    </p>
                </Container>
            </div>

            <Container>
                {/* Our Story */}
                <section className="about-section">
                    <Row className="align-items-center">
                        <Col md={6} className="mb-4 mb-md-0">
                            <img src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Our Workshop" className="about-img" />
                        </Col>
                        <Col md={6} className="ps-md-5">
                            <h2 className="display-6 fw-bold mb-4">Our Story</h2>
                            <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
                                Founded over two decades ago, S.D. Jewels began with a simple vision: to create jewelry that speaks to the soul.
                                What started as a small family workshop has grown into a renowned brand known for its commitment to quality and ethical sourcing.
                            </p>
                            <p className="text-muted" style={{ lineHeight: '1.8' }}>
                                Every piece in our collection is a labor of love, designed to be passed down through generations.
                                We believe that jewelry is more than just an accessory; it is a repository of memories and a celebration of individual style.
                            </p>
                            <div className="signature">S.D. Family</div>
                        </Col>
                    </Row>
                </section>

                {/* Stats / Values */}
                <section className="about-section">
                    <Row>
                        <Col md={4} className="mb-4">
                            <div className="stat-box">
                                <span className="stat-number">25+</span>
                                <span className="text-muted text-uppercase small ls-1">Years of Excellence</span>
                            </div>
                        </Col>
                        <Col md={4} className="mb-4">
                            <div className="stat-box">
                                <span className="stat-number">5k+</span>
                                <span className="text-muted text-uppercase small ls-1">Happy Customers</span>
                            </div>
                        </Col>
                        <Col md={4} className="mb-4">
                            <div className="stat-box">
                                <span className="stat-number">100%</span>
                                <span className="text-muted text-uppercase small ls-1">Ethically Sourced</span>
                            </div>
                        </Col>
                    </Row>
                </section>

                {/* Visit Us */}
                <section className="about-section text-center pb-5">
                    <Row className="justify-content-center">
                        <Col md={8}>
                            <h2 className="display-6 fw-bold mb-4">Visit Our Boutique</h2>
                            <p className="text-muted mb-4">
                                Experience the sparkle in person. Our experts are here to help you find the perfect piece.
                            </p>
                            <div className="d-flex justify-content-center gap-4 text-start d-inline-flex flex-column flex-md-row">
                                <div className="p-3">
                                    <h6 className="fw-bold"><i className="bi bi-geo-alt me-2"></i>Location</h6>
                                    <p className="text-muted small mb-0">123 Jewel Lane, Gold City<br />New York, NY 10012</p>
                                </div>
                                <div className="p-3">
                                    <h6 className="fw-bold"><i className="bi bi-clock me-2"></i>Hours</h6>
                                    <p className="text-muted small mb-0">Mon - Sat: 10:00 AM - 8:00 PM<br />Sun: 11:00 AM - 6:00 PM</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </section>
            </Container>
        </div>
    );
};

export default About;
