import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Form, Accordion, Offcanvas, Button } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './Shop.css';
import io from 'socket.io-client';

// --- Constants for Filter Options ---
const GENDER_OPTIONS = ["Women", "Men", "Kids", "Unisex"];
const OCCASION_OPTIONS = ["Daily Wear", "Party Wear", "Wedding", "Work Wear", "Anniversary", "Gift"];
const METAL_TYPE_OPTIONS = ["Gold", "Platinum", "Silver", "Brass"];
const METAL_COLOR_OPTIONS = ["Yellow", "White", "Rose", "Two-Tone"];
const STONE_TYPE_OPTIONS = ["Diamond", "Gemstone", "Pearl", "Polki", "Navratna", "Swarovski", "Cubic Zirconia", "Plain", "Solitaire"];
const STYLE_OPTIONS = [
    "Solitaire", "Halo", "Vintage", "Band", "Couple Rings", "Cluster", "Three Stone",
    "Studs", "Hoops", "Drops", "Jhumkas", "Chandbalis", "Sui Dhaga", "Ear Cuffs",
    "Chain", "Tennis", "Bangle", "Mangalsutra", "Pendant", "Collar"
];
const PRICE_RANGES = [
    { label: "Under ₹10,000", min: 0, max: 10000 },
    { label: "₹10,000 - ₹20,000", min: 10000, max: 20000 },
    { label: "₹20,000 - ₹30,000", min: 20000, max: 30000 },
    { label: "₹30,000 - ₹50,000", min: 30000, max: 50000 },
    { label: "₹50,000 - ₹75,000", min: 50000, max: 75000 },
    { label: "₹75,000 & Above", min: 75000, max: Infinity }
];

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');
    const categoryParam = searchParams.get('category'); // Legacy or Header link
    const collectionParam = searchParams.get('collection'); // From mega menu
    const occasionParam = searchParams.get('occasion'); // From mega menu

    // --- State ---
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('Featured');
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    // Filter State (Arrays for Multi-Select)
    const [filters, setFilters] = useState({
        category: [],
        gender: [],
        metalType: [],
        metalColor: [],
        stoneType: [],
        occasion: [],
        style: [],
        collectionName: [],
        price: [] // Array of labels or special identifiers
    });

    const [availableCategories, setAvailableCategories] = useState([]);

    // --- Initialization & Fetching ---
    useEffect(() => {
        window.scrollTo(0, 0);

        // Initialize filters from URL
        setFilters(prev => ({
            ...prev,
            category: categoryParam ? [categoryParam] : [],
            collectionName: collectionParam ? [collectionParam] : [],
            occasion: occasionParam ? [occasionParam] : [],
            // Reset others on new URL load if needed, or keep persistent? 
            // Usually URL overrides.
        }));
    }, [categoryParam, collectionParam, occasionParam]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Categories
                const catRes = await fetch('http://localhost:5000/api/categories');
                const catData = await catRes.json();
                if (catRes.ok) setAvailableCategories(catData.map(c => c.name));

                // Fetch Products
                const prodRes = await fetch('http://localhost:5000/api/products');
                const prodData = await prodRes.json();
                if (prodRes.ok) setProducts(prodData);

            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        const socket = io('http://localhost:5000');
        socket.on('data_updated', fetchData); // Simplistic refresh
        return () => socket.disconnect();
    }, []);


    // --- Handlers ---
    const handleFilterChange = (section, value) => {
        setFilters(prev => {
            const current = prev[section];
            const isSelected = current.includes(value);
            if (isSelected) {
                return { ...prev, [section]: current.filter(item => item !== value) };
            } else {
                return { ...prev, [section]: [...current, value] };
            }
        });
    };

    const handleClearAll = () => {
        setSearchParams({});
        setFilters({
            category: [],
            gender: [],
            metalType: [],
            metalColor: [],
            stoneType: [],
            occasion: [],
            style: [],
            collectionName: [],
            price: []
        });
    };

    // --- Filtering Logic ---
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // 1. Search Query
            if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // Helper to check array intersection or single value inclusion
            const checkMatch = (productValues, filterValues) => {
                if (filterValues.length === 0) return true; // No filter applied
                // Standardize productValues to array
                const pVals = Array.isArray(productValues) ? productValues : [productValues].filter(Boolean);
                // Check if ANY filter value exists in product values
                return filterValues.some(f => pVals.includes(f));
            };

            // 2. Attributes
            if (!checkMatch(product.category, filters.category)) return false;
            if (!checkMatch(product.gender, filters.gender)) return false;
            if (!checkMatch(product.metalType, filters.metalType)) return false;
            if (!checkMatch(product.metalColor, filters.metalColor)) return false;
            if (!checkMatch(product.stoneType, filters.stoneType)) return false;
            if (!checkMatch(product.occasion, filters.occasion)) return false;
            if (!checkMatch(product.style, filters.style)) return false;

            // Collection (Partial match support for flexible entry?) -> No, exact for now
            // But some collections might be substrings. checking distinct match
            if (filters.collectionName.length > 0) {
                const pCols = Array.isArray(product.collectionName) ? product.collectionName : [product.collectionName].filter(Boolean);
                // If any selected collection is in product collection
                const hasCol = filters.collectionName.some(c => pCols.includes(c));
                if (!hasCol) return false;
            }

            // 3. Price (Range logic)
            if (filters.price.length > 0) {
                // OR logic for price ranges (e.g. Under 10k OR Above 50k)
                const price = product.price;
                const matchPrice = filters.price.some(label => {
                    const range = PRICE_RANGES.find(r => r.label === label);
                    if (!range) return false;
                    return price >= range.min && price < range.max;
                });
                if (!matchPrice) return false;
            }

            return true;
        });
    }, [products, filters, searchQuery]);

    // --- Sorting Logic ---
    const sortedProducts = useMemo(() => {
        let sorted = [...filteredProducts];
        switch (sortBy) {
            case 'Price: Low to High':
                return sorted.sort((a, b) => a.price - b.price);
            case 'Price: High to Low':
                return sorted.sort((a, b) => b.price - a.price);
            case 'Newest First':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            default: // Featured (default fetch order or rating?)
                return sorted;
        }
    }, [filteredProducts, sortBy]);


    // Count active filters for badge
    const activeFilterCount = Object.values(filters).reduce((acc, arr) => acc + arr.length, 0);

    // Filter content component (reusable for desktop and mobile)
    const FilterContent = ({ idPrefix = '' }) => (
        <Accordion defaultActiveKey={['0', '1']} alwaysOpen flush className="filter-accordion">
            <Accordion.Item eventKey="0">
                <Accordion.Header>Price</Accordion.Header>
                <Accordion.Body className="px-0 py-2">
                    {PRICE_RANGES.map(range => (
                        <Form.Check
                            key={range.label}
                            type="checkbox"
                            id={`${idPrefix}price-${range.label}`}
                            label={range.label}
                            checked={filters.price.includes(range.label)}
                            onChange={() => handleFilterChange('price', range.label)}
                            className="mb-1 small text-muted"
                        />
                    ))}
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
                <Accordion.Header>Product Type</Accordion.Header>
                <Accordion.Body className="px-0 py-2">
                    {availableCategories.map(cat => (
                        <Form.Check
                            key={cat}
                            type="checkbox"
                            id={`${idPrefix}cat-${cat}`}
                            label={cat}
                            checked={filters.category.includes(cat)}
                            onChange={() => handleFilterChange('category', cat)}
                            className="mb-1 small text-muted"
                        />
                    ))}
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
                <Accordion.Header>Gender</Accordion.Header>
                <Accordion.Body className="px-0 py-2">
                    {GENDER_OPTIONS.map(opt => (
                        <Form.Check key={opt} type="checkbox" id={`${idPrefix}gen-${opt}`} label={opt} checked={filters.gender.includes(opt)} onChange={() => handleFilterChange('gender', opt)} className="mb-1 small text-muted" />
                    ))}
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
                <Accordion.Header>Metal</Accordion.Header>
                <Accordion.Body className="px-0 py-2">
                    <div className="mb-2"><small className="fw-bold text-muted">Type</small></div>
                    {METAL_TYPE_OPTIONS.map(opt => (
                        <Form.Check key={opt} type="checkbox" id={`${idPrefix}mt-${opt}`} label={opt} checked={filters.metalType.includes(opt)} onChange={() => handleFilterChange('metalType', opt)} className="mb-1 small text-muted" />
                    ))}
                    <div className="mt-2 mb-2"><small className="fw-bold text-muted">Color</small></div>
                    {METAL_COLOR_OPTIONS.map(opt => (
                        <Form.Check key={opt} type="checkbox" id={`${idPrefix}mc-${opt}`} label={opt} checked={filters.metalColor.includes(opt)} onChange={() => handleFilterChange('metalColor', opt)} className="mb-1 small text-muted" />
                    ))}
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
                <Accordion.Header>Stone</Accordion.Header>
                <Accordion.Body className="px-0 py-2">
                    {STONE_TYPE_OPTIONS.map(opt => (
                        <Form.Check key={opt} type="checkbox" id={`${idPrefix}st-${opt}`} label={opt} checked={filters.stoneType.includes(opt)} onChange={() => handleFilterChange('stoneType', opt)} className="mb-1 small text-muted" />
                    ))}
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="5">
                <Accordion.Header>Occasion</Accordion.Header>
                <Accordion.Body className="px-0 py-2">
                    {OCCASION_OPTIONS.map(opt => (
                        <Form.Check key={opt} type="checkbox" id={`${idPrefix}occ-${opt}`} label={opt} checked={filters.occasion.includes(opt)} onChange={() => handleFilterChange('occasion', opt)} className="mb-1 small text-muted" />
                    ))}
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="6">
                <Accordion.Header>Style</Accordion.Header>
                <Accordion.Body className="px-0 py-2">
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {STYLE_OPTIONS.map(opt => (
                            <Form.Check key={opt} type="checkbox" id={`${idPrefix}style-${opt}`} label={opt} checked={filters.style.includes(opt)} onChange={() => handleFilterChange('style', opt)} className="mb-1 small text-muted" />
                        ))}
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );

    return (
        <div className="shop-page">
            {/* Mobile Filter Offcanvas */}
            <Offcanvas show={showMobileFilter} onHide={() => setShowMobileFilter(false)} placement="start" className="mobile-filter-offcanvas">
                <Offcanvas.Header closeButton className="border-bottom">
                    <Offcanvas.Title className="fw-bold">
                        <i className="bi bi-funnel me-2"></i>
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="badge bg-primary ms-2 rounded-pill">{activeFilterCount}</span>
                        )}
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-0">
                    <div className="p-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted small">{filteredProducts.length} products</span>
                            <button className="btn btn-link p-0 text-decoration-none small text-danger fw-bold" onClick={handleClearAll}>
                                CLEAR ALL
                            </button>
                        </div>
                        <FilterContent idPrefix="mobile-" />
                    </div>
                </Offcanvas.Body>
                <div className="p-3 border-top bg-light">
                    <Button variant="dark" className="w-100 rounded-pill" onClick={() => setShowMobileFilter(false)}>
                        Show {filteredProducts.length} Results
                    </Button>
                </div>
            </Offcanvas>

            <Container fluid className="px-4 py-3">
                <Row>
                    {/* Desktop Filters Sidebar */}
                    <Col lg={2} md={3} className="d-none d-md-block pe-4">
                        <div className="filter-sidebar sticky-top" style={{ top: '80px', maxHeight: '90vh', overflowY: 'auto' }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="fw-bold text-uppercase text-dark" style={{ letterSpacing: '1px' }}>Filter By</span>
                                <button className="btn btn-link p-0 text-decoration-none small text-danger fw-bold" onClick={handleClearAll} style={{ fontSize: '0.75rem' }}>CLEAR ALL</button>
                            </div>
                            <FilterContent idPrefix="desktop-" />
                        </div>
                    </Col>

                    {/* Product Grid Area */}
                    <Col lg={10} md={9}>
                        {/* Sort/Header Row */}
                        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                            <div className="d-flex align-items-center gap-3">
                                {/* Mobile Filter Button */}
                                <Button
                                    variant="outline-dark"
                                    className="d-md-none rounded-pill px-3"
                                    onClick={() => setShowMobileFilter(true)}
                                >
                                    <i className="bi bi-funnel me-2"></i>
                                    Filters
                                    {activeFilterCount > 0 && (
                                        <span className="badge bg-primary ms-2 rounded-pill">{activeFilterCount}</span>
                                    )}
                                </Button>
                                <span className="text-muted small">{filteredProducts.length} items found</span>
                                {searchQuery && <span className="fw-bold">for "{searchQuery}"</span>}
                            </div>
                            <div className="d-flex align-items-center">
                                <span className="small text-muted me-2 d-none d-sm-inline">Sort By:</span>
                                <select
                                    className="form-select form-select-sm border-0 fw-bold bg-light"
                                    style={{ width: 'auto', boxShadow: 'none' }}
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option>Featured</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Newest First</option>
                                </select>
                            </div>
                        </div>

                        <Row className="g-3">
                            {loading ? (
                                <div className="text-center py-5 w-100">
                                    <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
                                </div>
                            ) : sortedProducts.length > 0 ? (
                                sortedProducts.map((product) => (
                                    <Col xs={6} sm={6} md={4} lg={3} key={product._id} className="product-grid-item">
                                        <ProductCard {...product} id={product._id} />
                                    </Col>
                                ))
                            ) : (
                                <div className="text-center py-5 w-100">
                                    <h4 className="text-muted fw-light">No products match your filters.</h4>
                                    <button className="btn btn-outline-primary mt-3" onClick={handleClearAll}>Reset Filters</button>
                                </div>
                            )}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Shop;
