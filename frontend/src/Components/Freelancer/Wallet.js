import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig/axiosConfig';

const Wallet = () => {
  const freelancer = JSON.parse(localStorage.getItem('@user'));
  const freelancerId = freelancer._id;

  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState(0);

  useEffect(() => {
    const fetchWalletDetails = async () => {
      try {
        const response = await axiosInstance.get(`/users/getWalletDetails/${freelancerId}`);
        if (response.status === 200) {
          setWalletBalance(response.data.balance);
          setTransactions(response.data.transactions);
        } else {
          console.error('Failed to fetch wallet details');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchWalletDetails();
  }, [freelancerId]);

  const handleWithdraw = async () => {
    if (withdrawAmount > walletBalance) {
      alert('Insufficient balance');
      return;
    }
    if (withdrawAmount <= 0) {
      alert('Enter a valid amount');
      return;
    }

    try {
      const response = await axiosInstance.post('/users/withdrawFunds', {
        freelancerId,
        amount: parseFloat(withdrawAmount),
      });

      if (response.status === 200) {
        alert('Withdrawal successful');
        setWalletBalance(response.data.balance);
        setWithdrawAmount('');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Withdrawal failed');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 mb-4 shadow-sm">
        <h3 className="mb-3">Wallet Balance</h3>
        <h4 className="text-success">₹{walletBalance.toFixed(2)}</h4>
      </div>

      <div className="card p-4 mb-4 shadow-sm">
        <h3 className="mb-3">Withdraw Funds</h3>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Enter amount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={handleWithdraw}
            disabled={!withdrawAmount}
          >
            Withdraw
          </button>
        </div>
      </div>

      <div className="card p-4 shadow-sm">
        <h3 className="mb-3">Transaction History</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Date</th>
              <th>Job ID</th>
              <th>Amount</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((txn, index) => (
                <tr key={index}>
                  <td>{new Date(txn?.date).toLocaleDateString()}</td>
                  <td>{txn.job_id?.job_title ? txn.job_id?.job_title : 'Transfer '}</td>
                  <td className={txn.type === 'credit' ? 'text-success' : 'text-danger'}>
                    ₹ {txn.amount.toFixed(2)}
                  </td>
                  <td>{txn.type}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Wallet;

