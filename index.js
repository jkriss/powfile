const pngPack = require('png-pack')
const { parseResponse } = require('parse-raw-http').parseResponse
const LF = '\r\n'
const keyword = 'PowData'

const makeResponse = (buf, headers={}) => {
  headers['Content-Length'] = buf.length
  const lines = [`HTTP/1.1 200 OK`]
  for (let k in headers) {
    lines.push(`${k}: ${headers[k]}`)
  }
  lines.push(LF)
  return Buffer.concat([Buffer.from(lines.join(LF)), buf])
}

const create = ({ image, data, contentType }) => {
  const res = makeResponse(data, { 'Content-Type': contentType })
  return pngPack.encode(image, res, { keyword })
}

const parse = (imageData) => {
  const buf = pngPack.decode(imageData, { keyword })
  const resObj = parseResponse(buf, { decodeContentEncoding: true })
  return { headers: resObj.headers, body: resObj.bodyData }
}

module.exports = {
  create,
  parse
}
