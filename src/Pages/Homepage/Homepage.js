import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SpatialNavigation, {
  Focusable,
  FocusableSection,
} from 'react-js-spatial-navigation';
import Navbar from '../../Components/layout/Navbar/Navbar';
import Image from '../../Components/commons/Image/Image';
import defaultChannelImage from '../../Assets/images/img1.png';
import placeholderImage from '../../Assets/images/placeholder.png';
import './Homepage.css';

const Homepage = () => {
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(''); // State to store the selected category
  const [playerType, setPlayerType] = useState('live'); // State to store the player type (movie or live)
  const [fileType, setFileType] = useState('m3u8'); // State to store the player type (movie or live)

  useEffect(() => {
    const backEvent = function (e) {
      if (e.keyName === 'back') {
        console.log('back event', e, window.location.href);
        window.history.back();
      }
    };

    const apiUrlCategories  = 'http://185.166.24.214:8080/player_api.php?username=onlinetv&password=onlinetv&action=get_live_categories';

    fetch(apiUrlCategories )
      .then((response) => response.json())
      .then((data) => {
        // Update the categories state with the data from the API
        setCategories(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });


    const apiUrlChannels  = 'http://185.166.24.214:8080/player_api.php?username=onlinetv&password=onlinetv&action=get_live_streams';

    // Fetch data from the API
    fetch(apiUrlChannels )
      .then((response) => response.json())
      .then((data) => {
        // Update the channels state with the data from the API
        setChannels(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    // add eventListener for tizenhwkey (Back Button)
    window.addEventListener('tizenhwkey', backEvent);
    return () => {
      window.removeEventListener('tizenhwkey', backEvent);
    };
  }, []);

  const filterHandler = (val) => {
    // Update the selected category when a category is clicked
    setSelectedCategory(val);
  };

  // Filter channels based on the selected category
  const filteredChannels = channels.filter((channel) => {
    return selectedCategory === '' || channel.category_id === selectedCategory;
  });


  const navFilter = (val) => {
    // Update the selected category when a category is clicked
    console.log(val);
    console.log(val==='movie');
    if(val==='movie'){
      setPlayerType('movie');
      setFileType('mp4');
      console.log(playerType);
      const apiUrlChannels  = 'http://185.166.24.214:8080/player_api.php?username=onlinetv&password=onlinetv&action=get_vod_streams';

    // Fetch data from the API
    fetch(apiUrlChannels)
      .then((response) => response.json())
      .then((data) => {
        // Update the channels state with the data from the API
        setChannels(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

      const apiUrlCategories  = 'http://185.166.24.214:8080/player_api.php?username=onlinetv&password=onlinetv&action=get_vod_categories';

      fetch(apiUrlCategories )
        .then((response) => response.json())
        .then((data) => {
          // Update the categories state with the data from the API
          setCategories(data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
  

    }else{
      const apiUrlChannels  = 'http://185.166.24.214:8080/player_api.php?username=onlinetv&password=onlinetv&action=get_live_streams';
      setPlayerType('live');
      setFileType('m3u8');
    // Fetch data from the API
    fetch(apiUrlChannels )
      .then((response) => response.json())
      .then((data) => {
        // Update the channels state with the data from the API
        setChannels(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

      const apiUrlCategories  = 'http://185.166.24.214:8080/player_api.php?username=onlinetv&password=onlinetv&action=get_live_categories';

      fetch(apiUrlCategories )
        .then((response) => response.json())
        .then((data) => {
          // Update the categories state with the data from the API
          setCategories(data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
  
    }

  };

  return (
    <div className='homepageWrapper'>
      <SpatialNavigation>
        <Navbar filterHandler={navFilter} />
        <section className='contentWrapper'>
        <div className='channelListWrapper'>
            <ul className='channelList'>
              <FocusableSection>
                <Focusable
                  onClickEnter={() => {
                    filterHandler('');
                  }}
                >
                  <li
                    onClick={() => {
                      filterHandler('');
                    }}
                    className='channelListItem'
                  >
                    All
                  </li>
                </Focusable>
                {categories.map((category) => (
                  <Focusable
                    key={category.category_id}
                    onClickEnter={() => {
                      filterHandler(category.category_id);
                    }}
                  >
                    <li
                      onClick={() => {
                        filterHandler(category.category_id);
                      }}
                      className='channelListItem'
                    >
                      {category.category_name}
                    </li>
                  </Focusable>
                ))}
              </FocusableSection>
            </ul>
          </div>
          <div className='channelsView'>
            {filteredChannels?.length ? (
              filteredChannels.map((channelItem, index) => {
                return (
                  <Focusable
                    onClickEnter={() => {
                      navigate(
                        `/channel?channelUrl=${window.encodeURIComponent(
                          `http://185.166.24.214:8080/${playerType}/onlinetv/onlinetv/${channelItem.stream_id}.${fileType}`
                        )}`
                      );
                    }}
                    key={index}
                  >
                    <span
                      onClick={() => {
                        navigate(
                          `/channel?channelUrl=${window.encodeURIComponent(
                            `http://185.166.24.214:8080/${playerType}/onlinetv/onlinetv/${channelItem.stream_id}.${fileType}`
                          )}`
                        );
                      }}
                      className='channelItem'
                      title={channelItem.name}
                    >
                      <Image
                        url={channelItem.stream_icon}
                        altUrl={defaultChannelImage}
                        alt='channelImage'
                        placeholderImage={placeholderImage}
                      />
                    </span>
                  </Focusable>
                );
              })
            ) : (
              <div className='noResults'>Sorry, No Results Found!</div>
            )}
          </div>
        </section>
      </SpatialNavigation>
    </div>
  );
};

export default Homepage;
