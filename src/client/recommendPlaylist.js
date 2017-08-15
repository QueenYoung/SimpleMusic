import { checkStatus, parseJson } from './fetchhelper';

const api = {
  highquality: '/top/playlist/highquality?',
  playlist: '/playlist/detail?',
  music: '/music/url?',
  search: '/search?',
  suggest: '/search/suggest?',
  recommendPlaylist: '/personalized',
  recommendSong: '/personalized/newsong'
}

async function getMusic(url, params = {}) {
  let query =
    Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&');
    console.log(url + query);
  const json = await
    fetch(url + query, {
    headers: new Headers({
      'Accept': 'application/json',
    }),
    cache: 'default'
    })
      .then(checkStatus)
      .then(parseJson)
  return json;
}

export { api, getMusic };