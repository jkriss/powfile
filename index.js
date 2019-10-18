const pngPack = require('png-pack')
const JSZip = require('jszip')
const { parseResponse } = require('parse-raw-http').parseResponse
const mime = require('mime')
const crypto = require('crypto')
const LF = '\r\n'
const ZIP_TYPE = 'application/zip'
const keyword = 'PowData'

const makeResponse = (buf, headers={}) => {
  headers['Date'] = (new Date()).toUTCString()
  headers['Content-Length'] = buf.length
  const hash = crypto.createHash('MD5')
  hash.update(buf)
  headers['ETag'] = hash.digest('hex')
  const lines = [`HTTP/1.1 200 OK`]
  for (let k in headers) {
    lines.push(`${k}: ${headers[k]}`)
  }
  lines.push(LF)
  return Buffer.concat([Buffer.from(lines.join(LF)), buf])
}

const create = async ({ image, data, files, contentType }) => {
  if ((!data && !files) || (data && files)) throw new Error('Must specify either data or files')
  if (!data) {
    // make a zip from the files map
    const zip = new JSZip()
    for (const filename of Object.keys(files)) {
      let fileData = files[filename]
      if (typeof fileData === 'string') fileData = Buffer.from(fileData)
      const res = makeResponse(fileData, { 'Content-Type': mime.getType(filename) })
      zip.file(filename, res) 
    }
    contentType = ZIP_TYPE 
    data = await zip.generateAsync({ type: 'nodebuffer' })
  }
  const res = makeResponse(data, { 'Content-Type': contentType })
  return pngPack.encode(image, res, { keyword })
}

const parse = async (imageData, opts={}) => {
  const buf = pngPack.decode(imageData, { keyword })
  if (opts.unzip) {
    const res = parseResponse(buf, { decodeContentEncoding: true })  
    if (res.headers['content-type'] === ZIP_TYPE) {
      return JSZip.loadAsync(res.bodyData)
    }
  }
  return buf
}

module.exports = {
  create,
  parse
}
