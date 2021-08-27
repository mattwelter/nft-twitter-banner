import './AssetItem.css';
import React, { useEffect, useState } from 'react';


const preloadImage =  src => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
    return img;
  });
}

const AssetItem = ({ asset, addAsset, delAsset, inAssets }) => {

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const preload = async src => {
      setLoading(true);
      await preloadImage(src);
      setLoading(false);
    };
    preload(asset.image_url);
  }, [asset]);

  const handleClick = (e) => {
    e.preventDefault();
    toggleAsset(asset);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 32) {
      e.preventDefault();
      toggleAsset(asset);
    }
  };

  const toggleAsset = (asset) => {
    if (inAssets(asset)) {
      delAsset(asset);
    } else {
      addAsset(asset);
    }
  }

  return (
    <div
      className="asset-item"
      tabIndex="0"
      onClick={handleClick.bind(this)}
      onKeyDown={handleKeyDown.bind(this)}
    >
      <div
        title={ `${[asset.collection.name, asset.name].filter(e => e).join(' - ')}` }
        style={{
          borderRadius: 3,
          width: '100%',
          paddingTop: '100%',
          backgroundColor: `${asset.background_color ? asset.background_color : '#eee'}`,
          backgroundImage: `url(${isLoading ? 'spinner.gif' : asset.image_url})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          filter: `brightness(${ inAssets(asset) ? '1.0' : '0.5'})`
        }}
      ></div>
    </div>
  );
};

export default AssetItem;
