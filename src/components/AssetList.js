import './AssetList.css';
import React, { useCallback, useEffect, useState, useRef } from 'react';

import AssetItem from './AssetItem';


const API_URL = 'https://api.opensea.io/api/v1/assets';

const getQueryString = function(params) {
  return Object.keys(params).map(k => {
    return `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`;
  }).join('&');
}

const AssetList = ({ addr, addAsset, delAsset, inAssets }) => {

  const [assets, setAssets] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isComplete, setComplete] = useState(false);
  const loader = useRef(null);

  const loadMore = useCallback((entries) => {
    const fetchItems = (offset) => {
      if (isComplete) {
        return;
      }
      setLoading(true);
      const qs = getQueryString({
        owner: addr,
        offset: offset,
        limit: 40
      })
      fetch(API_URL + '?' + qs)
        .then(resp => resp.json())
        .then(data => {
          if (data.assets.length > 0) {
            const newAssets = assets.concat(data.assets);
            setAssets(newAssets);
            setComplete(false);
          } else {
            setComplete(true);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
        })
    }

    const target = entries[0];
    if (target.isIntersecting) {
      !isLoading && fetchItems(assets.length);
    }
  }, [addr, assets, isComplete, isLoading]);

  useEffect(() => {
    const loader_current = loader.current;

    let opts = {
      root: null,
      rootMargin: '0px', // '20px'
      threshold: 1.0  // only observe when the entire box is in view
    };

    // create observer
    const observer = new IntersectionObserver(loadMore, opts);

    // observe the loader
    if (loader && loader.current) {
      observer.observe(loader.current);
    }

    // clean up on willUnMount
    return () => observer.unobserve(loader_current)
  }, [loader, loadMore]);

  useEffect(() => {
    // console.log('addr changed', addr);
    setAssets([]);
    setComplete(false);
  }, [addr]);

  return (
    <div className="asset-list-wrapper">
      <div className="asset-list">
        {
          assets.map((asset, index) => {
            return (
              <AssetItem
                key={index}
                name={asset.name}
                url={asset.image_url}
                asset={asset}
                addAsset={ addAsset }
                delAsset={ delAsset }
                inAssets={ inAssets }
              />
            )
          })
        }
      </div>

      <div className="loader" ref={loader}>
        { !isComplete && isLoading && <span>…</span> }
      </div>
    </div>
  )
};

export default AssetList;
