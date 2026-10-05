const Notification = ({ message, type }) => {
  if (!message) return null

  const style = {
    border: `2px solid ${type === 'error' ? 'red' : 'green'}`,
    color: type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  }

  return <div style={style}>{message}</div>
}

export default Notification
