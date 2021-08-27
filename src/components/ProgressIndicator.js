import './ProgressIndicator.css';

const ProgressIndicator = ({message}) => {
  return (
    <div
      className="overlay"
      style={{}}
    >
      <span
        className="progress-message"
        style={{}}
      >{ message }</span>
    </div>
  );
};

export default ProgressIndicator;
