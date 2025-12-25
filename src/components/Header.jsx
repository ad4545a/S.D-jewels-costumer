import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Header.css';
import './Header.responsive.css';

const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { cartCount } = useCart();
    const { user } = useAuth();
    const { wishlist } = useWishlist();

    const isLandingPage = location.pathname === '/';

    // --- Smart Scroll Logic ---
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > lastScrollY && window.scrollY > 100) {
                    setShowHeader(false);
                } else {
                    setShowHeader(true);
                }
                setLastScrollY(window.scrollY);
            }
        };

        window.addEventListener('scroll', controlNavbar);
        return () => window.removeEventListener('scroll', controlNavbar);
    }, [lastScrollY]);

    // Effect to handle body padding dynamically
    useEffect(() => {
        if (isLandingPage) {
            document.body.style.paddingTop = '0px';
        } else {
            document.body.style.paddingTop = '115px';
        }
        return () => {
            document.body.style.paddingTop = '';
        };
    }, [isLandingPage]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
            setSearchTerm('');
        }
    };

    // --- Mega Menu Data Structure ---
    const menuItems = [
        {
            label: "Rings",
            link: "/shop?category=Ring",
            megaMenu: {
                featured: ["Latest Designs", "Bestsellers"],
                style: ["All Rings", "Engagement", "Dailywear", "Infinity", "Cocktail", "Solitaire", "Couple Rings", "Bands", "Promise Rings"],
                metal: ["Diamond", "Pearl", "Navratna", "Gemstone", "Platinum", "Gold", "Rose Gold", "Yellow Gold", "White Gold"],
                price: ["Under ₹ 10k", "₹ 10k - ₹ 20k", "₹ 20k - ₹ 30k", "₹ 30k - ₹ 50k", "₹ 40k - ₹ 50k", "₹ 50k - ₹ 75k", "₹ 75k & Above"],
                images: [
                    { label: "Solitaire Rings", src: "https://cdn.caratlane.com/media/static/images/V4/2023/CL/05-MAY/AppBanner/Message_Bands/01/2x.jpg" }
                ]
            }
        },
        {
            label: "Earrings",
            link: "/shop?category=Earrings",
            megaMenu: {
                featured: ["Latest Designs", "Bestsellers"],
                style: ["All Earrings", "Studs", "Hoops", "Drops", "Earcuffs", "Sui Dhagas", "Jhumkas", "Chandbalis", "Silver Earrings"],
                metal: ["Diamond", "Pearl", "Navratna", "Gemstone", "Platinum", "Rose Gold", "Yellow Gold", "White Gold", "22kt Gold"],
                price: ["Under ₹ 10k", "₹ 10k - ₹ 20k", "₹ 20k - ₹ 30k", "₹ 30k - ₹ 50k", "₹ 50k - ₹ 75k", "₹ 75k & Above"],
                images: [
                    { label: "Jhumkas", src: "https://cdn.caratlane.com/media/static/images/V4/2023/CL/10-OCT/AppBanner/Switch/02/2x.jpg" },
                    { label: "Hoops", src: "https://cdn.caratlane.com/media/static/images/V4/2023/CL/10-OCT/AppBanner/Dancing_Hoops/01/2x.jpg" }
                ]
            }
        },
        {
            label: "Bracelets & Bangles",
            link: "/shop?category=Bracelet",
            megaMenu: {
                featured: ["Latest Designs", "Bestsellers"],
                style: ["All Bracelets & Bangles", "Adjustable Bracelets", "Chain Bracelets", "Flexible Bracelets", "Tennis Bracelets", "Bridal Bangles", "Lightweight Bangles"],
                metal: ["Diamond", "Gemstone", "Rose Gold", "Platinum", "Pearl", "Navratna", "Yellow Gold", "White Gold", "22kt Gold"],
                price: ["Under ₹ 10k", "₹ 10k - ₹ 20k", "₹ 20k - ₹ 30k", "₹ 30k - ₹ 50k", "₹ 50k - ₹ 75k", "Above ₹ 75k"],
                images: [
                    { label: "Stretchy Bangles", src: "https://cdn.caratlane.com/media/static/images/V4/2023/CL/11-NOV/AppBanner/Stretchable/01/2x.jpg" }
                ]
            }
        },
        {
            label: "Solitaires",
            link: "/shop?category=Solitaire",
            megaMenu: {
                featured: ["Latest Solitaires", "Best Selling Solitaires", "Custom Solitaires"],
                style: ["Solitaire Rings", "Solitaire Earrings", "Solitaire Pendants", "Solitaire Mangalsutras", "Solitaire Bands"],
                metal: ["18kt Gold", "Platinum", "White Gold", "Yellow Gold", "Rose Gold"],
                price: ["₹ 20k - ₹ 50k", "₹ 50k - ₹ 1L", "₹ 1L - ₹ 2L", "₹ 2L & Above"],
                images: [
                    { label: "Forevermark", src: "https://cdn.caratlane.com/media/static/images/V4/2023/CL/09-SEP/AppBanner/Solitaire/01/2x.jpg" }
                ]
            }
        },
        {
            label: "Mangalsutras",
            link: "/shop?category=Mangalsutra",
            megaMenu: {
                featured: ["New Arrivals", "Best Sellers", "Lightweight"],
                style: ["Modern Mangalsutra", "Traditional", "Gold Mangalsutra", "Diamond Mangalsutra", "Bracelet Mangalsutra", "Chain Mangalsutra"],
                metal: ["Yellow Gold", "Rose Gold", "White Gold", "Diamond", "Gemstone"],
                price: ["Under ₹ 20k", "₹ 20k - ₹ 40k", "₹ 40k - ₹ 60k", "₹ 60k - ₹ 1L", "Above ₹ 1L"],
                images: [
                    { label: "Modern Mangalsutras", src: "https://cdn.caratlane.com/media/static/images/V4/2023/CL/08-AUG/AppBanner/Mangalsutra/02/2x.jpg" }
                ]
            }
        },
        {
            label: "Necklaces & Pendants",
            link: "/shop?category=Necklace",
            megaMenu: {
                featured: ["New Launches", "Gift Ideas", "Bridal Sets"],
                style: ["Chains", "Lockets", "Pendants", "Collar Necklaces", "Layered Necklaces", "Long Necklaces", "Pearl Necklaces"],
                metal: ["Gold", "Diamond", "Gemstone", "Pearl", "Silver", "Platinum", "Rose Gold"],
                price: ["Under ₹ 10k", "₹ 10k - ₹ 20k", "₹ 20k - ₹ 40k", "₹ 40k - ₹ 75k", "Above ₹ 75k"],
                images: [
                    { label: "Layered Chains", src: "https://cdn.caratlane.com/media/static/images/V4/2023/CL/07-JUL/AppBanner/Necklace/01/2x.jpg" }
                ]
            }
        },
        {
            // Placeholder for "Silver" to show flexibility
            label: "Silver",
            link: "/shop?metalType=Silver",
            megaMenu: {
                featured: ["New In Silver", "Best of Shaya", "Oxidized"],
                style: ["Earrings", "Necklaces", "Rings", "Bracelets", "Anklets", "Toe Rings", "Nose Pins"],
                metal: ["925 Silver", "Gold Plated", "Oxidized Silver", "Rose Gold Plated"],
                price: ["Under ₹ 2000", "₹ 2000 - ₹ 5000", "Above ₹ 5000"],
                images: [
                    { label: "Shaya Silver", src: "https://cdn.caratlane.com/media/static/images/V4/2023/CL/06-JUN/AppBanner/Shaya/01/2x.jpg" }
                ]
            }
        },
        {
            label: "Gifting",
            link: "/shop",
            megaMenu: {
                featured: ["Gifts for Her", "Gifts for Him", "Gifts for Kids"],
                style: ["Birthday", "Anniversary", "Wedding", "Graduation", "First Job", "Just Because"],
                metal: ["Under ₹ 5k", "₹ 5k - ₹ 10k", "₹ 10k - ₹ 20k", "₹ 20k - ₹ 50k", "Premium Gifts"],
                price: [], // Merged with metal for diverse columns in this case or keep empty
                images: [
                    { label: "Gift Box", src: "https://cdn.caratlane.com/media/static/images/V4/2023/CL/05-MAY/AppBanner/Gifting/02/2x.jpg" }
                ]
            }
        },
        {
            label: "Collections",
            link: "/shop",
            megaMenu: {
                featured: ["Butterfly", "Aaranya", "Ombre", "Bee"],
                style: ["Orchids", "Mogra", "Peacock", "Lotus", "Harry Potter", "Disney"],
                metal: ["Blaze", "Dunes", "Intermix", "Borla", "Dhokra"],
                price: [],
                images: [
                    { label: "Butterfly", src: "https://cdn.caratlane.com/media/static/images/V4/2023/CL/04-APR/AppBanner/Butterfly/01/2x.jpg" }
                ]
            }
        }
    ];

    return (
        <header className={`main-header ${isLandingPage ? 'landing-mode' : ''} ${!showHeader ? 'header-hidden' : ''}`}>
            {/* Top Bar: Logo, Search, Icons */}
            <div className="header-top">
                <Link to="/" className="brand-logo">
                    <i className="bi bi-gem me-2"></i>S.D. JEWELS
                </Link>

                <div className="center-links">
                    <Link to="/" className="top-nav-link">Home</Link>
                    <Link to="/shop" className="top-nav-link">Jewellery</Link>
                </div>

                <div className="header-actions">
                    <form className="search-bar-compact" onSubmit={handleSearch}>
                        <i className="bi bi-search search-icon"></i>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>

                    <div className="utility-icons">
                        <button type="button" className="action-icon btn-reset" title="Store Locator">
                            <i className="bi bi-geo-alt"></i>
                        </button>
                        <button type="button" className="action-icon btn-reset" title="Language/Region">
                            <i className="bi bi-globe"></i>
                            <span className="lang-code">IN</span>
                        </button>
                    </div>

                    <div className="action-divider"></div>

                    <Link to={user ? "/profile" : "/login"} className="action-icon" title="Profile">
                        <i className="bi bi-person"></i>
                    </Link>

                    <Link to="/wishlist" className="action-icon" title="Wishlist">
                        <i className="bi bi-heart"></i>
                        {wishlist.length > 0 && <span className="badge-count">{wishlist.length}</span>}
                    </Link>

                    <Link to="/cart" className="action-icon" title="Cart">
                        <i className="bi bi-bag"></i>
                        {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
                    </Link>
                </div>
            </div>

            {/* Navigation Bar */}
            <nav className="header-nav">
                <ul className="nav-menu">
                    {menuItems.map((item, index) => (
                        <li key={index} className="nav-item">
                            <Link to={item.link} className="nav-link-custom">
                                {item.label}
                            </Link>

                            {/* Mega Menu Dropdown */}
                            {item.megaMenu && (
                                <div className="mega-menu">
                                    <div className="mega-menu-content">
                                        {/* Featured Column */}
                                        {item.megaMenu.featured && item.megaMenu.featured.length > 0 && (
                                            <div className="menu-column">
                                                <span className="menu-title">Featured</span>
                                                <ul className="menu-list">
                                                    {item.megaMenu.featured.map((link, i) => (
                                                        <li key={i}><Link to={`/shop?search=${link}`}>{link}</Link></li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Style Column */}
                                        {item.megaMenu.style && item.megaMenu.style.length > 0 && (
                                            <div className="menu-column">
                                                <span className="menu-title">By Style</span>
                                                <ul className="menu-list">
                                                    {item.megaMenu.style.map((link, i) => (
                                                        <li key={i}><Link to={`/shop?search=${link}`}>{link}</Link></li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Metal Column */}
                                        {item.megaMenu.metal && item.megaMenu.metal.length > 0 && (
                                            <div className="menu-column">
                                                <span className="menu-title">By Metal & Stone</span>
                                                <ul className="menu-list">
                                                    {item.megaMenu.metal.map((link, i) => (
                                                        <li key={i}><Link to={`/shop?search=${link}`}>{link}</Link></li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Price Column */}
                                        {item.megaMenu.price && item.megaMenu.price.length > 0 && (
                                            <div className="menu-column">
                                                <span className="menu-title">By Price</span>
                                                <ul className="menu-list">
                                                    {item.megaMenu.price.map((link, i) => (
                                                        <li key={i}><Link to="/shop">{link}</Link></li> // Linking to shop general for price ranges
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Images Column */}
                                        {item.megaMenu.images && item.megaMenu.images.length > 0 && (
                                            <div className="menu-image-col">
                                                {item.megaMenu.images.map((img, i) => (
                                                    <Link to="/shop" key={i} className="menu-promo">
                                                        <img src={img.src} alt={img.label} onError={(e) => e.target.style.display = 'none'} />
                                                        <span className="promo-label">{img.label}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer Links */}
                                    <div className="mega-menu-footer">
                                        <Link to="/shop?gender=Women" className="text-decoration-none fw-bold text-dark me-4">For Women</Link>
                                        <Link to="/shop?gender=Men" className="text-decoration-none fw-bold text-dark me-4">For Men</Link>
                                        <Link to="/shop?gender=Kids" className="text-decoration-none fw-bold text-dark">For Kids</Link>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
};

export default Header;