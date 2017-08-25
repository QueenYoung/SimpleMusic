import { checkStatus, parseJson } from './fetchhelper';

const api = {
  highquality: '/top/playlist/highquality?',
  playlist: '/playlist/detail?',
  music: '/music/url?',
  search: '/search?',
  suggest: '/search/suggest?',
  recommendPlaylist: '/personalized',
  recommendSong: '/personalized/newsong'
};

function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject('timeout'), ms);
  });
}

function getMusic(url, params = {}) {
  let query = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  console.log(url + query);

  return Promise.race([
    timeout(10000),
    fetch(url + query, {
      headers: new Headers({
        Accept: 'application/json'
      }),
      cache: 'default'
    })
      .then(checkStatus)
      .then(parseJson)
  ]);
}

const audioCtx = new AudioContext();
let source = audioCtx.createBufferSource();
async function loadAudio(url) {
  try {
    const audioSrc = await fetch(url, {
      headers: new Headers({ 'Response-Type': 'arraybuffer' })
    })
      .then(res => res.arrayBuffer())
      .then(buffer => audioCtx.decodeAudioData(buffer))
      .then(decodedData => {
        source.buffer = decodedData;
        source.connect(audioCtx.destination);
      });
    audioSrc.start();
    return audioSrc;
  } catch (err) {
    throw Error(err);
  }
}

export { api, getMusic, loadAudio };
