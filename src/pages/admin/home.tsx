import { useState, useEffect } from 'react';
import { get_admin_token } from './login';
import './home.scss';
import { useNavigate } from 'react-router';
// import 'bootstrap/dist/css/bootstrap.min.css';

// --- Helper Functions & API Client ---

// A basic API client. Replace with your actual API client.
const apiClient = {
    get: async (url: string) => {
        const token = get_admin_token();
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    },
    post: async (url: string, body: any) => {
        const token = get_admin_token();
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Request failed');
        }
        return response.json();
    }
};

// --- Type Definitions ---
interface Transaction {
    id: number;
    user_id: number;
    user_name: string;
    transaction_code: string;
    status: 'PENDING' | 'COMPLETED' | 'EXPIRED' | 'CANCELED';
    description: string;
    amount: number;
    currency: string;
    created_ts: number;
    completed_ts: number | null;
}

// --- Main Component ---
export default function AdminHomePage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isApproving, setIsApproving] = useState(false);

    const navigate = useNavigate();

    const fetchTransactions = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await apiClient.get('/api/admin/payments/list');
            setTransactions(data.transactions || []);
        } catch (err) {
            setError('Failed to fetch payment requests. Please check your login session.');
            console.error(err);
            setTimeout(function () {
                navigate('/admin/login');
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleStatusChange = (transactionId: number, newStatus: string) => {
        const transaction = transactions.find(t => t.id === transactionId);
        if (!transaction) return;

        if (transaction.status === 'PENDING' && newStatus === 'COMPLETED') {
            setSelectedTransaction(transaction);
            setShowConfirmModal(true);
        }
        // In a real app, you might handle other status changes here (e.g., to CANCELED)
    };

    const handleConfirmApproval = async () => {
        if (!selectedTransaction) return;

        setIsApproving(true);
        try {
            await apiClient.post('/api/admin/payments/approve', {
                transaction_id: selectedTransaction.id
            });
            alert('Transaction approved successfully!');
            setShowConfirmModal(false);
            setSelectedTransaction(null);
            fetchTransactions(); // Refresh the list
        } catch (err) {
            if (err instanceof Error) {
                alert(`Approval failed: ${err.message}`);
            } else {
                alert('An unknown error occurred during approval.');
            }
        } finally {
            setIsApproving(false);
        }
    };

    const renderConfirmationModal = () => {
        if (!showConfirmModal || !selectedTransaction) return null;

        return (
            <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Payment Approval</h5>
                            <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <p>Please confirm you have received the payment for the following transaction:</p>
                            <ul className="list-group">
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Transaction ID
                                    <span>{selectedTransaction.id}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    UserID
                                    <span>{selectedTransaction.user_id}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    UserName
                                    <span>{selectedTransaction.user_name}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Transaction Code
                                    <span>{selectedTransaction.transaction_code}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Amount
                                    <span className="fw-bold">{selectedTransaction.amount.toLocaleString()} {selectedTransaction.currency}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Description
                                    <span>{selectedTransaction.description}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Created At
                                    <span>{new Date(selectedTransaction.created_ts * 1000).toLocaleString()}</span>
                                </li>
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>Cancel</button>
                            <button type="button" className="btn btn-success" onClick={handleConfirmApproval} disabled={isApproving}>
                                {isApproving ? 'Approving...' : 'Confirm Approval'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="admin-home-page-container container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Payment Requests</h1>
                <button className="btn btn-outline-primary" onClick={fetchTransactions} disabled={isLoading}>
                    Refresh
                </button>
            </div>

            {isLoading && <div className="text-center"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!isLoading && !error && (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>UserID</th>
                                <th>User.Name</th>
                                <th>Code</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Created At</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center">No payment requests found.</td>
                                </tr>
                            ) : (
                                transactions.map(tx => (
                                    <tr key={tx.id}>
                                        <td>{tx.id}</td>
                                        <td>{tx.user_id}</td>
                                        <td>{tx.user_name}</td>
                                        <td>{tx.transaction_code}</td>
                                        <td>{tx.description}</td>
                                        <td>{tx.amount.toLocaleString()} {tx.currency}</td>
                                        <td>{new Date(tx.created_ts * 1000).toLocaleString()}</td>
                                        <td>
                                            <select
                                                className="form-select"
                                                value={tx.status}
                                                disabled={tx.status !== 'PENDING'}
                                                onChange={(e) => handleStatusChange(tx.id, e.target.value)}
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="COMPLETED">Approve</option>
                                                {/* Add other statuses if needed, e.g., Canceled */}
                                                {tx.status === 'COMPLETED' && <option value="COMPLETED">Completed</option>}
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {renderConfirmationModal()}
        </div>
    );
}
