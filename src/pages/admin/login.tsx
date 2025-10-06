import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './home.scss';
// import 'bootstrap/dist/css/bootstrap.min.css';

// A basic API client function. Replace with your actual API client.
async function apiLogin(username: string, password: string) {
    const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
}

export const ADMIN_ACCESS_TOKEN_KEY = 'admin_token';

export function store_admin_token(token: string) {
    try {
        localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, token);
    } catch (error) {
        console.error("Failed to store access token:", error);
    }
}

export function get_admin_token() {
    try {
        return localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY);
    } catch (error) {
        console.error("Failed to retrieve access token:", error);
        return null;
    }
}

export default function AdminLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const data = await apiLogin(username, password);
            // On success, you would typically save the token and redirect
            console.log('Login successful, token:', data.token);
            // alert('Login successful!');
            // For example:
            store_admin_token(data.token);
            navigate('/admin/home');

            // localStorage.setItem('adminAuthToken', data.token);
            // window.location.href = '/admin/dashboard';
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className=".admin-home-page-container container vh-100 d-flex justify-content-center align-items-center">
            <div className="card p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <h3 className="card-title text-center mb-4">Admin Login</h3>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="usernameInput" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="usernameInput"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="passwordInput" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="passwordInput"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
