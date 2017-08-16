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

async function getMusic(url, params = {}) {
  let query = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  console.log(url + query);
  const json = await fetch(url + query, {
    headers: new Headers({
      Accept: 'application/json'
    }),
    cache: 'default'
  })
    .then(checkStatus)
    .then(parseJson);
  return json;
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
