import './RenderingResults.css';
import React from 'react';

const RenderingResults = ({ dataURL }) => {
  return (
    <React.Fragment>
      <div className="banner-wrapper" style={{ }}>
        <img
          src={dataURL}
          className="banner"
          alt="preview"
          style={{}}
        />
      </div>
      <div className="download-wrapper" style={{}}>
        <a
          className="download-btn"
          style={{ }}
          href={dataURL}
          download="banner.jpg"
        >Download</a>
      </div>
    </React.Fragment>
  );
};

export default RenderingResults;
