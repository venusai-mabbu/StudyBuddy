import React from 'react';

const Message = ({ message, type = 'info', onClose }) => (
  <div className={`message message-${type}`}>
    {message}
    {onClose && (
      <button className="message-close" onClick={onClose}>×</button>
    )}
  </div>
);

export default Message;