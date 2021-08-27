import './RenderingDetails.css';
import React from 'react';

import { alignments } from '../services/Renderer';

const RenderingDetails = ({
  canRender, renderImage,
  isAssetSelected,
  backgroundImages,
  backgroundImage,
  setBackgroundImage,
  alignment,
  setAlignment,
  isCropped,
  setCropped
}) => {

  const handleChange = (setter, e) => {
    if (setter === setCropped) {
      setCropped(!isCropped);
    } else {
      setter(setter === setAlignment
        ? parseInt(e.target.value, 10)
        : e.target.value);
    }

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    renderImage();
  };

  return (
    <form onSubmit={ handleSubmit.bind(this) }>
      <div className="row">
        <div className="col-25">
          <label htmlFor="background-image">Background Image</label>
        </div>
        <div className="col-75">
          <select
            id="background-image"
            name="background"
            value={backgroundImage}
            onChange={handleChange.bind(this, setBackgroundImage)}
          >
            <option value="" disabled> -- Select An Option -- </option>
            {
              Object.keys(backgroundImages).map((k, index) => {
                return <option key={index} value={k}>{backgroundImages[k]}</option>
              })
            }
          </select>
        </div>
      </div>
      <div className="row">
        <div className="col-25">
          <label htmlFor="alignment">Vertical Alignment</label>
        </div>
        <div className="col-75">
          <select
            name="alignment"
            value={alignment}
            onChange={handleChange.bind(this, setAlignment)}
          >
            {
              Object.keys(alignments).map((k, index) => {
                return <option key={index} value={k}>{alignments[k]}</option>
              })
            }
          </select>
        </div>
      </div>
      <div className="row">
        <div className="col-25">
          <label htmlFor="cropped">Crop Images</label>
        </div>
        <div className="col-75">
          <input
            type="checkbox"
            id="cropped"
            name="cropped"
            onChange={handleChange.bind(this, setCropped)}
            checked={isCropped}
          />
        </div>
      </div>
      <div className="row">
        <input type="submit" disabled={ !canRender() } value="Generate" />
      </div>
    </form>
  );
};

export default RenderingDetails;
