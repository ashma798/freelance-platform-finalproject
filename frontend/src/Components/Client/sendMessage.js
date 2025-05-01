import React, { useState } from 'react';
import axios from 'axios';

const sendMessage = () => {
  const [freelancerId, setFreelancerId] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/sendMessage',
        { freelancerId, message },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          },
        }
      );

      if (res.data.success) {
        setStatus('Message sent successfully!');
        setFreelancerId('');
        setMessage('');
      }
    } catch (err) {
      setStatus('Failed to send message.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow">
            <h4 className="mb-4">Send Message to Freelancer</h4>
            {status && <div className="alert alert-info">{status}</div>}

            <form onSubmit={handleSend}>
              <div className="mb-3">
                <label className="form-label">Freelancer ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={freelancerId}
                  onChange={(e) => setFreelancerId(e.target.value)}
                  placeholder="Enter Freelancer ID"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Your Message</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default sendMessage;
