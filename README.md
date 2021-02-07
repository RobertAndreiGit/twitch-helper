# twitch-helper
Web application for handling song/video requests made with channel points in a twitch channel.

## Install

If you want to run this application on your own device, go to the root directory of the project and create a file called data.js where you will store the secrets of your twitch application (data obtained by going to the [twitch dev console](https://dev.twitch.tv)).

```js
data.js

module.exports = {
  TWITCHCLIENTID: "<YOUR_ID_GOES_HERE>",
  TWITCHSECRET: "<YOUR_TWITCH_SECRET_GOES_HERE>",
  SESSIONSECRET: "<SESSION_SECRET_GOES_HERE>" // you generate a random string basically
};
```
