function checkStatus(res) {
  if (res.ok) {
    return res;
  } else {
    throw Error(res.statusText);
  }
}

const api = {
  highquality: '/top/playlist/highquality?',
  playlist: '/playlist/detail?',
  music: '/music/url?',
  search: '/search?',
  suggest: '/search/suggest?',
  recommendPlaylist: '/personalized',
  recommendSong: '/personalized/newsong'
};
if (process.env.NODE_ENV !== 'development') {
  Object.keys(api).forEach(key => {
    api[key] = 'http://localhost:4000'.concat(api[key]);
  });
}

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
  let networkDataReceived = false;

  const networkUpdate = Promise.race([
    timeout(20000),
    fetch(url + query, {
      headers: new Headers({
        Accept: 'application/json'
      }),
      mode: 'cors',
      cache: 'default'
    })
      .then(checkStatus)
      .then(res => {
        networkDataReceived = true;
        return res.json();
      })
  ]);

  return caches.match(url).then(res => {
    if (!res) throw Error('No data.');
    return res.json();
  }).then(data => {
    if (!networkDataReceived) {
      return data;
    }
  })
  .catch(() => networkUpdate)
  .catch((err) => console.log(err));
}

/*
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
*/

export { api, getMusic };
