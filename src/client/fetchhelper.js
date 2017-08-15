function checkStatus(res) {
  if (res.ok) {
    return res;
  } else {
    throw Error(res.statusText);
  }
}

function parseJson(res) {
  return res.json();
}

function parseBlob(res) {
  return res.blob();
}

export { checkStatus, parseJson, parseBlob };