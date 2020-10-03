import React, { useState, useEffect } from 'react'
import styles from './css/small.module.css'
import { Container } from 'reactstrap'
import SpotifyWebApi from 'spotify-web-api-js'
import FastAverageColor from 'fast-average-color'

const fac = new FastAverageColor()

export default function Widget ({ hash }) {
  const [song, setSong] = useState({
    id: null,
    name: '',
    progress: [0, 0],
    playing: false,
    artists: [],
    album: { url: '', name: '' }
  })

  useEffect(() => {
    const spotifyApi = new SpotifyWebApi()
    spotifyApi.setAccessToken(hash.access_token)

    fetchSong()

    function fetchSong () {
      spotifyApi.getMyCurrentPlayingTrack().then(songFetch => {
        if (songFetch.item.id !== song.id) {
          const result = {
            id: songFetch.item.id,
            name: songFetch.item.name,
            progress: [songFetch.progress_ms, songFetch.item.duration_ms],
            playing: songFetch.is_playing,
            artists: songFetch.item.artists,
            album: { url: songFetch.item.album.images[0].url, name: songFetch.item.album.name }
          }
          setSong(result)
        }
        setTimeout(fetchSong, 2500)
      }).catch(err => {
        console.log(err)
      })
    }
  }, [])

  useEffect(() => {
    var container = document.querySelector(`.${styles.vinyl}`)
    fac.getColorAsync(song.album.url)
      .then(function (color) {
        container.style.backgroundColor = color.rgba
      })
      .catch(function (e) {
        console.log(e)
      })
  }, [song.album.url])

  return (
    <Container fluid>
      <div className={joinClasses('music-player-container')}>
        <div className={joinClasses('music-player')}>
          <div className={styles['song-data']}>
            <h1 className={styles['artist-name']}>{song.artists.map(a => a.name).join(', ')}</h1>
            <h2 className={styles['song-title']}>{song.name}</h2>
            <h3 className={styles['album-title']}>{song.album.name}</h3>
          </div>
        </div>
        <div className={styles['album-container']}>
          <div className={styles['album-box']}>
            <div
              style={{ backgroundImage: `url("${song.album.url}"), url("/images/cover.jpg")` }}
              className={joinClasses('d-flex align-items-end', 'album-art')}
            >
              <div className={joinClasses(styles.progress, 'd-flex')}>
                <div className={joinClasses('mt-auto', styles.bar)} style={{ width: `calc(${song.progress[0] / song.progress[1] * 100}% - 15px)` }} />
                <div className={joinClasses('mt-auto', styles.markerContainer)}>
                  <div className={joinClasses('', styles.marker)} />
                </div>
              </div>
            </div>
            <div className={joinClasses('vinyl', song.playing && 'rotate')} style={{ backgroundImage: 'url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/83141/vinyl.png")' }} />
          </div>
        </div>
      </div>
    </Container>
  )
}

function joinClasses (...classes) {
  return classes.map(c => styles[c] || c).join(' ')
}
