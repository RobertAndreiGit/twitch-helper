import React, { useEffect, useState } from 'react';
import Cookies, { set } from 'js-cookie';
import axios from 'axios';

import MainPage from '../MainPage/MainPage';

import cls from './LoginPage.module.scss';


function App() {
  let cookieValue = undefined;
  if(Cookies.get('auth_token'))
    cookieValue = JSON.parse(Cookies.get('auth_token').substr(2));


  const [isLoged, setIsLoged] = useState(false);
  const [user, ] = useState(cookieValue);
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    if(user){
      console.log("ALOOOOOOOO");
      setIsLoged(true);
      const subJSON = {
        type: "LISTEN",
        data: {
          topics: [`channel-points-channel-v1.${user.data[0].id}`],
          auth_token: user.accessToken
        }
      }
      const pingJSON = {
        type: "PING"
      }
      console.log(JSON.stringify(subJSON));

      let ws = new WebSocket('wss://pubsub-edge.twitch.tv');

      ws.onopen = () => {
        ws.send(JSON.stringify(pingJSON));
        ws.send(JSON.stringify(subJSON));
      };

      ws.onmessage = (ev) => {
        console.log(ev);
        let data = JSON.parse(ev.data);
        let message = null;
        if(data.data)
          message = JSON.parse(data.data.message);
        if(message){
          const reg = /((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?/g;
          console.log(message.data.redemption.reward.title);

          let url = reg.exec(message.data.redemption.user_input);
          console.log(message.data.redemption.user_input);
          if(url.length > 0)
            setUrls(oldurls => [...oldurls, url[0]]);
        } else {
          console.log(message);
        }
      }
    }
  }, [user])

  const handleURLChange = () => {
    let urlsCopy = urls; 
    setUrls(urlsCopy.splice(1));
  }

  useEffect(() => {
    console.log(urls);
  }, [urls])

  return (
    <div className={cls.app}>
      {!isLoged && <>
          <button className={cls.loginButton}>
            <a href='https://apps.robertandrei.tk/be/auth/twitch'>
            Log in
            </a>
          </button>
        </>
      }
      {isLoged && <>
        <h1>{`Hello ${user.data[0].display_name}`}</h1>
        <MainPage url={urls[0]} onended={handleURLChange} playstatus={true}/>
      </>}
    </div>
  );
}

export default App;
