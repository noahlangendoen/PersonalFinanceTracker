import e from 'cors';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        type: '',
        description: '',
        category: '',
        amount: '',
        date: ''
});
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/transactions`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (response.ok) {
                setTransactions(data);
            } else {
                setError(data.message || 'Failed to fetch transactions');
            }
        } catch (err) {
            setError('An error occurred while fetching transactions.');
        }
    };

    const handleChange = (e) => {
        setForm({ 
            ...form,
            [e.target.name]: e.target.value
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            if (response.ok) {
                setMessage('Transaction added successfully!');
                setForm({
                    description: '',
                    category: '',
                    amount: '',
                    date: ''
                });
                fetchTransactions();
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to add transaction');
            } 
        } catch (err) {
            setMessage('An error occurred while adding the transaction.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white px-8 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-blue-600">All Transactions</h1>
                <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition duration-300"
                >
                Back to Dashboard
                </button>
            </div>

            <h2 className="text-xl font-semibold text-blue-700 mb-4">Transaction History</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="flex flex-wrap md:flex-nowrap gap-4 mb-8 bg-white p-6 rounded-lg shadow-md border border-blue-100 items-end">
                <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="border border-blue-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    required
                    className="border border-blue-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="" disabled>Select Type</option>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>

                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    className="border border-blue-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="border border-blue-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={handleChange}
                    required
                    className="border border-blue-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    type="submit"
                    className="md:col-span-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition duration-300 mt-2"
                >
                    Add Transaction
                </button>
            </form>
            {message && (
            <div style={{ color: message === 'Transaction added!' ? 'green' : 'red' }}>
                {message}
            </div>
            )}

            <ul className="space-y-3">
                {transactions.length === 0 ? (
                <li className="text-blue-400 italic">No transactions found.</li>
                ) : (
                transactions.map((transaction) => (
                    <li
                    key={transaction._id}
                    className="flex justify-between items-center bg-white rounded-lg p-4 shadow-md border border-blue-100"
                    >
                    <span className="text-blue-700">{new Date(transaction.date).toLocaleDateString()}</span>
                    <span className="text-blue-700">{transaction.description}</span>
                    <span className="text-blue-700">{transaction.category}</span>
                    <span className="text-blue-700 font-semibold">${transaction.amount}</span>
                    </li>
                ))
                )}
            </ul>
        </div>
    );
};


export default Transactions;


