const { create, parse } = require('../index')
const fs = require('fs')
const path = require('path')
const JSZip = require('jszip')
const { parseResponse } = require('parse-raw-http').parseResponse

const image = fs.readFileSync(path.join(__dirname, 'floppy.png'))

const run = async () => {
  // the multiple file version
  const files = {
    'index.html': '<h1>Hello, world!</h1>',
    'more stuff/text files/hi.txt': 'This is just a text file'
  }
  const imageWithData = await create({ image, files })

  const zip = await parse(imageWithData, { unzip: true })
  
  zip.forEach(filepath => console.log(filepath))
  
  const index = await zip.file('index.html').async('nodebuffer')
  console.log(`\nindex file:\n\n${index.toString()}`)
}

run()

