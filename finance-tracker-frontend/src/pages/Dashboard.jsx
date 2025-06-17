import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/transactions`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch transactions');
                }

                const data = await response.json();
                setTransactions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    
    return (
        <div className="dashboard-container">
            <aside className="dashboard-sidebar">
                <h2 className="dashboard-title">Dashboard</h2>
                <nav className="dashboard-nav">
                    <button>Dashboard</button>
                    <button onClick={() => navigate('/transactions')}>Transactions</button>
                    <button>Budgets</button>
                    <button>Reports</button>
                    <button>Settings</button>
                </nav>
            </aside>

            <main className="dashboard-main">
                <div className="dashboard-header">
                    <h1>Finance Tracker</h1>
                    <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition duration-300"
                    onClick={handleLogout}
                    >
                    Logout
                    </button>
                </div>

                <div className="dashboard-transactions">
                    <h2>Recent Transactions</h2>
                    <ul>
                        {transactions.length === 0 && (
                            <li>No transactions found.</li>
                        )}
                        {transactions.map((transaction) => (
                            <li key={transaction._id}>
                            <span>{transaction.date}</span>
                            <span>{transaction.description}</span>
                            <span>${transaction.amount}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;