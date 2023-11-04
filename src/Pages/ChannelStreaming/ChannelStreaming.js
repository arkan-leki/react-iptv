import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import './ChannelStreaming.css';
import SpatialNavigation, {
  Focusable,
  FocusableSection,
} from 'react-js-spatial-navigation';

const ChannelStreaming = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  console.log('searchParams', searchParams.get('channelUrl'));

  useEffect(() => {
    const backEvent = function (e) {
      if (e.keyName === 'back') {
        console.log('back event', e, window.location.href);
        window.history.back();
      }
    };

    // add eventListener for tizenhwkey (Back Button)
    window.addEventListener('tizenhwkey', backEvent);
    return () => {
      window.removeEventListener('tizenhwkey', backEvent);
    };
  }, []);

  return (
    <SpatialNavigation>

    <div className='channelStreamingWrapper'>
      <ReactPlayer
        className='player-wrapper'
        url={
          window.decodeURIComponent(searchParams.get('channelUrl')) ||
          'http://forevertv.me:8080/movie/anand615/pass123/87757.mp4'
        }
        autoPlay
        playing
        controls
        width='100%'
        height='90%'
        onBuffer={() => {
          console.log('buffer');
          setLoading(true);
        }}
        onBufferEnd={() => {
          console.log('bufferEnd');
          loading && setLoading(false);
        }}
        onPlay={() => {
          console.log('play');
          loading && setLoading(false);
        }}
      />
      
      {loading && (
        <div className='loaderContainer'>
          <div className='fa-3x'>
            <i className='fas fa-spinner fa-pulse'></i>
          </div>
        </div>
      )}
      <div className='button-container'>
          <Focusable>
            <button
              className='focusable-button'
              onClick={() => window.history.back()}
            >
              Back
            </button>
          </Focusable>
          <Focusable>
            <button
              className='focusable-button'
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </Focusable>
          <Focusable>
            <button
              className='focusable-button'
              onClick={() => (window.location.href = '/channels')}
            >
              Channels
            </button>
          </Focusable>
          <Focusable>
            <button
              className='focusable-button'
              onClick={() => (window.location.href = '/movies')}
            >
              Movies
            </button>
          </Focusable>
        </div>
    </div>
    </SpatialNavigation>
  );
};

export default ChannelStreaming;
