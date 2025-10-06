import { useState, useEffect } from 'react';
import './SamplePayment.css';
import { getAccessToken } from '../../authentication';

// Assumes you have an API client that handles auth tokens.
// Replace with your actual API client.
const apiClient = {
    get: async (url: string) => {
        const token = getAccessToken();
        if (token == null) {
            throw new Error('Please login again');
        }

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    },
    post: async (url: string) => {
        const token = getAccessToken();
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    }
};

// --- Type Definitions ---
interface Transaction {
    id: number;
    status: 'PENDING' | 'COMPLETED' | 'EXPIRED' | 'CANCELED';
    description: string;
    amount: number;
    currency: string;
    created_ts: number;
    completed_ts: number | null;
}

interface NewPaymentDetails {
    qr_url: string;
    transaction_code: string;
    amount: number;
    message: string;
}

// --- Main Component ---
export default function SamplePayment() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showQrModal, setShowQrModal] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState<NewPaymentDetails | null>(null);
    const [isCreatingPayment, setIsCreatingPayment] = useState(false);

    const fetchTransactions = async () => {
        try {
            setIsLoading(true);
            const data = await apiClient.get('/api/users/payment/list');
            setTransactions(data.transactions || []);
        } catch (err) {
            setError('Failed to fetch payment history.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleNewPaymentRequest = async () => {
        setIsCreatingPayment(true);
        try {
            const data = await apiClient.post('/api/users/payment/premium');
            setPaymentDetails(data);
            setShowQrModal(true);
        } catch (err) {
            alert('Failed to create payment request. Please try again.');
            console.error(err);
        } finally {
            setIsCreatingPayment(false);
        }
    };

    const renderStatusBadge = (status: string) => {
        return <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>;
    };

    return (
        <div className="payment-container">
            <div className="payment-header">
                <h1>My Payments</h1>
                <button
                    onClick={handleNewPaymentRequest}
                    disabled={isCreatingPayment}
                    className="upgrade-button"
                >
                    {isCreatingPayment ? 'Generating...' : 'Upgrade to Premium'}
                </button>
            </div>

            {isLoading && <p>Loading payment history...</p>}
            {error && <p className="error-message">{error}</p>}

            {!isLoading && !error && (
                <div className="transaction-list">
                    {transactions.length === 0 ? (
                        <p>No payment history found.</p>
                    ) : (
                        transactions.map(tx => (
                            <div key={tx.id} className="transaction-item">
                                <div className="transaction-details">
                                    <p className="transaction-description">{tx.description}</p>
                                    <p className="transaction-date">
                                        Created: {new Date(tx.created_ts * 1000).toLocaleString()}
                                    </p>
                                </div>
                                <div className="transaction-info">
                                    {renderStatusBadge(tx.status)}
                                    <p className="transaction-amount">
                                        {tx.amount.toLocaleString()} {tx.currency}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {showQrModal && paymentDetails && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Scan to Pay</h2>
                        <p>{paymentDetails.message}</p>
                        <img src={paymentDetails.qr_url} alt="VietQR Code" className="qr-code-image" />
                        <div className="modal-info">
                            <p><strong>Amount:</strong> {paymentDetails.amount.toLocaleString()} VND</p>
                            <p><strong>Memo:</strong> {paymentDetails.transaction_code}</p>
                        </div>
                        <button onClick={() => {
                            setShowQrModal(false);
                            fetchTransactions(); // Refresh list after closing modal
                        }} className="close-button">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
