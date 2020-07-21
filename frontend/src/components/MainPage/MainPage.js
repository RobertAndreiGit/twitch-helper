import React, { Component, useState } from 'react'
import { findDOMNode } from 'react-dom'
import ReactPlayer from 'react-player'
import screenfull from 'screenfull'

import './MainPage.css'

function MainPage({player, url, onended, playstatus}) {
  const [pip, setPip] = useState(false);
  const [playing, setPlaying] = useState(playstatus);
  const [controls, setControls] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [seeking, setSeeking] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [loop, setLoop] = useState(false);

  console.log(playing);
  console.log(url);

  const load = url => {
    setPlayed(0);
    setLoaded(0);
    setPip(false);
  }

  const handlePlayPause = () => {
    setPlaying(!playing);
  }

  const handleStop = () => {
    onended();
    setPlaying(false);
  }

  const handleToggleControls = () => {
      setControls(!controls);
      load(url);
  }

  const handleToggleLoop = () => {
    setLoop(!loop);
  }

  const handleVolumeChange = e => {
    setVolume(parseFloat(e.target.value));
  }

  const handleToggleMuted = () => {
    setMuted(!muted);
  }

  const handleSetPlaybackRate = e => {
    setPlaybackRate(parseFloat(e.target.value));
  }

  const handleTogglePIP = () => {
    setPip(!pip);
  }

  const handlePlay = () => {
    console.log('onPlay')
    setPlaying(true);
  }

  const handleEnablePIP = () => {
    console.log('onEnablePIP')
    setPip(true);
  }

  const handleDisablePIP = () => {
    console.log('onDisablePIP')
    setPip(false);
  }

  const handlePause = () => {
    console.log('onPause')
    setPlaying(false);
  }

  const handleSeekMouseDown = e => {
    setSeeking(true);
  }

  const handleSeekChange = e => {
    setPlayed(parseFloat(e.target.value));
  }

  const handleSeekMouseUp = e => {
    setSeeking(false);
    player.seekTo(parseFloat(e.target.value))
  }

  /*const handleProgress = state => {
    console.log('onProgress', state)
    // We only want to update time slider if we are not currently seeking
    if (!state.seeking) {
      setState(state)
    }
  }*/

  const handleEnded = () => {
    console.log('onEnded')
    onended();
    setPlayed(loop);
  }

  const handleDuration = (duration) => {
    console.log('onDuration', duration)
    setDuration(duration);
  }

  const handleClickFullscreen = () => {
    screenfull.request(findDOMNode(player))
  }

  const renderLoadButton = (url, label) => {
    return (
      <button onClick={() => load(url)}>
        {label}
      </button>
    )
  }

  const ref = player => {
    player = player
  }

    return (
      <div className='app'>
        <section className='section'>
          <div className='player-wrapper'>
            <ReactPlayer
              ref={ref}
              className='react-player'
              width='100%'
              height='100%'
              url={url}
              pip={pip}
              playing={playing}
              controls={controls}
              loop={loop}
              playbackRate={playbackRate}
              volume={volume}
              muted={muted}
              onReady={() => console.log('onReady')}
              onStart={() => console.log('onStart')}
              onPlay={handlePlay}
              onEnablePIP={handleEnablePIP}
              onDisablePIP={handleDisablePIP}
              onPause={handlePause}
              onBuffer={() => console.log('onBuffer')}
              onSeek={e => console.log('onSeek', e)}
              onEnded={handleEnded}
              onError={e => console.log('onError', e)}
              //onProgress={handleProgress}
              onDuration={handleDuration}
            />
          </div>

          <table>
            <tbody>
              <tr>
                <th>Controls</th>
                <td>
                  <button onClick={handleStop}>Stop</button>
                  <button onClick={handlePlayPause}>{playing ? 'Pause' : 'Play'}</button>
                  <button onClick={handleClickFullscreen}>Fullscreen</button>
                  {ReactPlayer.canEnablePIP(url) &&
                    <button onClick={handleTogglePIP}>{pip ? 'Disable PiP' : 'Enable PiP'}</button>}
                </td>
              </tr>
              <tr>
                <th>Speed</th>
                <td>
                  <button onClick={handleSetPlaybackRate} value={1}>1x</button>
                  <button onClick={handleSetPlaybackRate} value={1.5}>1.5x</button>
                  <button onClick={handleSetPlaybackRate} value={2}>2x</button>
                </td>
              </tr>
              <tr>
                <th>Seek</th>
                <td>
                  <input
                    type='range' min={0} max={0.999999} step='any'
                    value={played}
                    onMouseDown={handleSeekMouseDown}
                    onChange={handleSeekChange}
                    onMouseUp={handleSeekMouseUp}
                  />
                </td>
              </tr>
              <tr>
                <th>Volume</th>
                <td>
                  <input type='range' min={0} max={1} step='any' value={volume} onChange={handleVolumeChange} />
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor='controls'>Controls</label>
                </th>
                <td>
                  <input id='controls' type='checkbox' checked={controls} onChange={handleToggleControls} />
                  <em>&nbsp; Requires player reload</em>
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor='muted'>Muted</label>
                </th>
                <td>
                  <input id='muted' type='checkbox' checked={muted} onChange={handleToggleMuted} />
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor='loop'>Loop</label>
                </th>
                <td>
                  <input id='loop' type='checkbox' checked={loop} onChange={handleToggleLoop} />
                </td>
              </tr>
              <tr>
                <th>Played</th>
                <td><progress max={1} value={played} /></td>
              </tr>
              <tr>
                <th>Loaded</th>
                <td><progress max={1} value={loaded} /></td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    )
}

export default MainPage