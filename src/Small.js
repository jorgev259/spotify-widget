/* global Audio, MediaMetadata */
import React from 'react'
import styles from './css/small.module.css'
import io from 'socket.io-client'
import anime from 'animejs/lib/anime.es.js'
import { Container } from 'reactstrap'
import $ from 'jquery'

export default class Small extends React.Component {
  componentDidMount () {
    this.spin = anime({
      targets: `.${styles.vinyl}`,
      rotate: '1turn',
      loop: true,
      duration: 1500,
      easing: 'linear',
      autoplay: true
    })
    setInterval(() => this.setState({ maxWidth: $(`.${styles['music-player']}`).outerWidth() }), 1000)
  }

  render () {
    return (
      <Container fluid>
        <div className={joinClasses('music-player-container', this.state.min ? 'min' : '')}>
          <div className={joinClasses('music-player')}>
            <div className={styles['song-data']}>
              <h1 className={styles['artist-name']}>{this.state.songData.artist}</h1>
              <h2 className={styles['song-title']}>{this.state.songData.title}</h2>
              <h3 className={styles['album-title']}>{this.state.songData.album}</h3>
            </div>
          </div>
          <div className={styles['album-container']}>
            <div className={styles['album-box']} style={{ left: this.state.min ? `-${this.state.maxWidth - 5}px` : null }}>
              <div
                style={{ backgroundImage: `url("https://squid-radio.net/covers/${this.state.songData.album}.jpg"), url("/images/logo/soc_${this.props.station}.png")` }}
                className={joinClasses('album-art')}
              />
              <div className={styles.vinyl} style={{ backgroundImage: `url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/83141/vinyl.png"), url("/images/station/station_${this.props.station}.png")` }} />
            </div>
          </div>
        </div>
      </Container>
    )
  }
}

function joinClasses (...classes) {
  return classes.map(c => styles[c] || c).join(' ')
}
