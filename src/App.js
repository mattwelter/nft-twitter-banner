import './App.css';
import React, { useState, useEffect } from 'react';
import { renderToImage } from './services/Renderer';

import AssetList from './components/AssetList';
import ProgressIndicator from './components/ProgressIndicator';
import RenderingDetails from './components/RenderingDetails';
import RenderingResults from './components/RenderingResults';


const MAX_AMOUNT = 9;
const ETH_ADDR = '0x4f0fe3269b1844e5a6c81bfe961206abdee5d589';
// const ETH_ADDR =  '0x6c4cb3c4da1cdc4b7b1f41099f6eacbd82d8f2d2';
// const ETH_ADDR = '';

// TODO: Use and parse params to pass backgrounds
// const backgroundImages = {
//   'background_1.jpg': 'Background 1',
//   'background_2.jpg': 'Background 2',
//   'background_3.jpg': 'Background 3',
// };

const splitBackgrounds = function(val) {
  // if (val === null) {
  //   return backgroundImages;
  // }
  let result = {},
      tokens = val.split(',');
  tokens.forEach((item, i) => {
    let [k,v] = item.split('-');
    result[k.trim()] = v.trim();
  });
  return result;
}

function App(props) {

  const [ownerID, setOwnerID] = useState(ETH_ADDR);

  const [assets, setAssets] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [alignment, setAlignment] = useState(0);
  const [isCropped, setCropped] = useState(false);
  const [dataURL, setDataURL] = useState('');
  const [isRendering, setRendering] = useState(false);

  const addAsset = (asset) => {
    // console.log('add', asset);
    if (assets.length >= MAX_AMOUNT) {
      return;
    }
    const newAssets = [...assets];
    newAssets.push(asset);
    setAssets(newAssets);
  };

  const delAsset = (asset) => {
    // console.log('rm', asset);
    const newAssets = assets.filter(item => item.token_id !== asset.token_id);
    setAssets(newAssets);
  };

  const inAssets = (asset) => {
    return assets.filter(item => item.token_id === asset.token_id).length > 0;
  };

  const isAssetSelected = () => {
    return 0 < assets.length;
  };

  const canRender = () => {
    return !isRendering && backgroundImage && isAssetSelected();
  };

  const renderImage = async (backgroundImage, assets, alignment, crop) => {
    // console.log('render image');
    if (!canRender()) {
      return;
    }
    setRendering(true);
    setDataURL(null);

    // TODO: How to proceed with missing urls.
    const imageURLs = assets
      .filter(asset => asset.image_url)
      .map(asset => asset.image_url );
    try {
      const imageURL = await renderToImage(backgroundImage, imageURLs, alignment, crop);
      setDataURL(imageURL);
    } catch(err) {
      // TODO: Handle error here!
      console.error(err);
    }

    setRendering(false);
  };

  const generateImage = () => {
    renderImage(backgroundImage, assets, alignment, isCropped);
  };

  const handleChange = (setter, e) => {
    setter(e.target.value);
  };

  // currently unused
  // const validateOwnerID = ownerID => {
  //   return ownerID === '' || /^0x[0-9a-f]{40}$/.test(ownerID);
  // }

  useEffect(() => {
    setAssets([]);
    setDataURL(null);
  }, [ownerID]);

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', }}>

      <div className="main">
        <div className="sidebar" style={{ }}>

          <AssetList
            addr={ ownerID }
            addAsset={ addAsset }
            delAsset={ delAsset }
            inAssets={ inAssets }
          />

        </div>
        <div className="content" style={{ }}>
          <div style={{ padding: '0.5rem 1rem', backgroundColor: '#2c2d2f', color: '#fff' }}>
            <div className="row">
              <div className="col-25">
                <label htmlFor="onwerID">ETH Address</label>
              </div>
              <div className="col-25">
                <input
                  type="text"
                  onChange={handleChange.bind(this, setOwnerID)}
                  value={ownerID}
                  placeholder="ETH Address"
                  pattern="0x[0-9a-f]{40}"
                  maxLength="42"
                  size="42"
                />
              </div>
            </div>
          </div>

          <RenderingDetails
            backgroundImages={splitBackgrounds(props.bgStr)/*backgroundImages*/}
            backgroundImage={backgroundImage}
            setBackgroundImage={setBackgroundImage}
            alignment={alignment}
            setAlignment={setAlignment}
            isAssetSelected={isAssetSelected}
            renderImage={generateImage}
            canRender={canRender}
            isCropped={isCropped}
            setCropped={setCropped}
          />

          { dataURL && <RenderingResults dataURL={dataURL} />}
        </div>
      </div>
      { isRendering && <ProgressIndicator message={'Work in progress.'} /> }
    </div>
  );
}

export default App;
