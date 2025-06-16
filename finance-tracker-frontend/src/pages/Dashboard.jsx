import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        window.location.href = '/';
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    
    return (
        <div className="dashboard-container">
            <aside className="dashboard-sidebar">
                <h2 className="dashboard-title">Dashboard</h2>
                <nav className="dashboard-nav">
                    <button>Dashboard</button>
                    <button>Transactions</button>
                    <button>Budgets</button>
                    <button>Reports</button>
                    <button>Settings</button>
                </nav>
            </aside>

            <main className="dashboard-main">
                <div className="dashboard-header">
                    <h1>Finance Tracker</h1>
                    <button className="logout-button" onclick={handleLogout}>Logout</button>
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