import React from 'react';

const Inbox = () => {
  const messages = [
    {
      id: 1,
      sender: 'Client A',
      message: 'Hello,Are you interested to work on my profile?',
      time: '10 mins ago'
    },
   
  ];

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Inbox</h2>

      {messages.map((msg) => (
        <div className="card shadow-sm mb-3" key={msg.id}>
          <div className="card-body d-flex justify-content-between align-items-center">
            
            <div>
              <h5 className="card-title mb-1">{msg.sender}</h5>
              <p className="card-text mb-0 text-muted">{msg.message}</p>
            </div>

            <div className="text-end text-secondary small">
              {msg.time}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Inbox;
