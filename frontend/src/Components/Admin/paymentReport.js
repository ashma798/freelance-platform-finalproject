import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentReport = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPayments = async (search = '', status = '') => {
    setLoading(true);
    try {
      const response = await axios.get(`/users/paymentReport?search=${search}&status=${status}`);
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    fetchPayments(searchTerm, status);
  }, [searchTerm, status]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6">Payment Report</h2>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by job title or client name"
          className="px-4 py-2 w-full md:w-1/3 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 w-full md:w-1/3 border rounded"
        >
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="released">Released</option>
          <option value="hold">Hold</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Payment Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Job Title</th>
              <th className="px-4 py-2 text-left">Client Name</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Payment Status</th>
              <th className="px-4 py-2 text-left">Payment Date</th>
              <th className="px-4 py-2 text-left">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">Loading...</td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment._id} className="border-t">
                  <td className="px-4 py-2">{payment.jobTitle}</td>
                  <td className="px-4 py-2">{payment.clientName}</td>
                  <td className="px-4 py-2">₹{parseFloat(payment.amount).toFixed(2)}</td>
                  <td className="px-4 py-2">{payment.status}</td>
                  <td className="px-4 py-2">{payment.paymentDate}</td>
                  <td className="px-4 py-2">{payment.paymentMethod}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentReport;
