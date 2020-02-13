const normalizeUrl = require('normalize-url')

export const house = "\u{1f3e0}"

export const Importances = [
  [0,   'Real-time'],
  [1,   'Daily'],
  [7,   'Weekly'],
  [30,  'Monthly'],
  [365, 'Year']
]

export async function responseToObject (resp) {
  let headers = {}
  let body = await resp.text()
  for (let h of resp.headers)
    headers[h[0].toLowerCase()] = h[1]
  return {status: resp.status, ok: resp.ok, url: resp.url, body, headers}
}

export function getIndexById (ary, id) {
  for (let i = 0; i < ary.length; i++) {
    if (ary[i].id == id)
      return i
  }
  return -1
}

export function getMaxIndex (index) {
  let vals = Object.values(index)
  if (vals.length == 0)
    return 0
  return Math.max(...vals)
}

export function urlToFeed(abs, href) {
  return normalizeUrl(url.resolve(abs, href), {stripWWW: false, stripHash: true, removeTrailingSlash: false})
}

export function urlToNormal (link) {
  return normalizeUrl(link, {stripProtocol: true, removeDirectoryIndex: true, stripHash: true})
}

export function urlToID (normLink) {
  let hashInt = normLink.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)
  return `${normLink.split('/')[0]}-${(hashInt >>> 0).toString(16)}`
}

export function followTitle(follow) {
  return follow.title || follow.actualTitle || urlToNormal(follow.url)
}

//
// HTML traversal and string building.
//
function innerHtmlDom(node) {
  let v = node.value || node.nodeValue
  if (v) return v

  if (node.hasChildNodes())
  {
    v = ''
    for (let c = 0; c < node.childNodes.length; c++) {
      let n = node.childNodes[c]
      v += n.value || n.nodeValue || n.innerHTML
    }
  }
  return v
}


export function xpathDom(doc, node, path, asText, ns) {
  let lookup = null
  if (ns) lookup = (pre) => ns[pre]
  let result = doc.evaluate(path, node, lookup, 4, null), list = []
  if (result) {
    while (true) {
      let node = result.iterateNext()
      if (node) {
        list.push(asText ? innerHtmlDom(node) : node)
      } else {
        break
      }
    }
  }
  return list
}

