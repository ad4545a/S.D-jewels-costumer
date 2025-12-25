import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/'); // Redirect to Home
        } catch (err) {
            setError('Failed to login. Please check your credentials.');
        }

        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="mb-4">
                    <i className="bi bi-gem auth-icon"></i>
                </div>
                <h2 className="auth-title">Welcome Back</h2>
                <p className="auth-subtitle">Sign in to continue your journey</p>

                {error && <Alert variant="danger" className="text-start small py-2">{error}</Alert>}

                <Form onSubmit={handleSubmit} className="auth-form text-start">
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button disabled={loading} className="auth-btn" type="submit">
                        {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                </Form>

                <div className="auth-footer">
                    Don't have an account?
                    <Link to="/signup" className="auth-link">Create Account</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
