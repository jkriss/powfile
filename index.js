const pngPack = require('png-pack')
const JSZip = require('jszip')
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

const create = async ({ image, data, files, contentType }) => {
  if ((!data && !files) || (data && files)) throw new Error('Must specify either data or files')
  if (!data) {
    // make a zip from the files map
    const zip = new JSZip()
    for (const filename of Object.keys(files)) {
      const fileData = files[filename]
      zip.file(filename, fileData) 
    }
    contentType = 'application/zip'
    data = await zip.generateAsync({ type: 'nodebuffer' })
  }
  const res = makeResponse(data, { 'Content-Type': contentType })
  return pngPack.encode(image, res, { keyword })
}

const parse = (imageData) => {
  return pngPack.decode(imageData, { keyword })
}

module.exports = {
  create,
  parse
}
