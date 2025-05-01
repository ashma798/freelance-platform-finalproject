function Message({ message }) {
    return (
      <div style={{ margin: "10px 0" }}>
        <strong>{message.username}: </strong>
        {message.text}
      </div>
    );
  }
  
  export default Message;
  