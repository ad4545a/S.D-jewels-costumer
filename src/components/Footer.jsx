import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white text-dark py-5 border-top">
            <Container>
                <Row>
                    <Col md={3} className="mb-4">
                        <h5 className="fw-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>S.D. JEWELS</h5>
                        <p className="text-muted small">Crafting elegance since 2025.</p>
                    </Col>
                    <Col md={3} className="mb-4">
                        <h6 className="fw-bold text-uppercase mb-3">Shop</h6>
                        <ul className="list-unstyled small text-muted">
                            <li className="mb-2"><Link to="/shop?category=Hot+Selling" className="text-decoration-none text-muted">New Arrivals</Link></li>
                            <li className="mb-2"><Link to="/shop?category=Best+Products" className="text-decoration-none text-muted">Best Sellers</Link></li>
                            <li className="mb-2"><Link to="/shop?search=Ring" className="text-decoration-none text-muted">Rings</Link></li>
                        </ul>
                    </Col>
                    <Col md={3} className="mb-4">
                        <h6 className="fw-bold text-uppercase mb-3">About</h6>
                        <ul className="list-unstyled small text-muted">
                            <li className="mb-2">Our Story</li>
                            <li className="mb-2">Contact</li>
                            <li className="mb-2">FAQ</li>
                        </ul>
                    </Col>
                    <Col md={3} className="mb-4">
                        <h6 className="fw-bold text-uppercase mb-3">Social</h6>
                        <div className="d-flex gap-3">
                            <a href="https://www.instagram.com/sd_jewels_agra/" target="_blank" rel="noopener noreferrer" className="text-dark">
                                <i className="bi bi-instagram"></i>
                            </a>
                            <i className="bi bi-facebook"></i>
                            <a href="https://wa.link/8qgcmn" target="_blank" rel="noopener noreferrer" className="text-dark">
                                <i className="bi bi-whatsapp"></i>
                            </a>
                        </div>
                    </Col>
                </Row>
                <div className="text-center pt-4 border-top mt-4">
                    <small className="text-muted">&copy; 2025 S.D. Jewels. Minimal Theme.</small>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
