import './style.css'
import { works } from './works.js'

const PLAY = 'M8 5v14l11-7z'
const PAUSE = 'M7 5h4v14H7zM13 5h4v14h-4z'

document.querySelector('#works').innerHTML = works.map((w) => `
  <li class="work">
    <button class="play" aria-label="Play ${w.title}">
      <svg viewBox="0 0 24 24"><path d="${PLAY}"/></svg>
    </button>
    <div class="info"><h3>${w.title}</h3><p>${w.source}, for ${w.ensemble}</p></div>
    <div class="bar" role="slider" aria-label="Seek ${w.title}"><i></i></div>
    <a class="score" href="${w.score}" target="_blank" rel="noopener">Score</a>
  </li>`).join('')

const audio = new Audio()
let current = -1
const rows = [...document.querySelectorAll('.work')]
const setIcon = (row, d) => row.querySelector('path').setAttribute('d', d)

function reset(row) {
  row.classList.remove('on')
  setIcon(row, PLAY)
  row.querySelector('.bar i').style.width = '0'
}

rows.forEach((row, i) => {
  row.querySelector('.play').onclick = () => {
    if (current === i) return audio.paused ? audio.play() : audio.pause()
    if (current >= 0) reset(rows[current])
    current = i
    audio.src = works[i].audio
    audio.play()
    row.classList.add('on')
  }
  const bar = row.querySelector('.bar')
  bar.onclick = (e) => {
    if (current !== i || !audio.duration) return
    const r = bar.getBoundingClientRect()
    audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration
  }
})

audio.onplay = () => current >= 0 && setIcon(rows[current], PAUSE)
audio.onpause = () => current >= 0 && setIcon(rows[current], PLAY)
audio.onended = () => { reset(rows[current]); current = -1 }
audio.ontimeupdate = () => {
  if (current < 0 || !audio.duration) return
  rows[current].querySelector('.bar i').style.width = (audio.currentTime / audio.duration) * 100 + '%'
}
