const { create, parse } = require('../index')
const fs = require('fs')
const path = require('path')

const image = fs.readFileSync(path.join(__dirname, 'floppy.png'))
const data = Buffer.from('Hello, world!')
const contentType = 'text/plain'

// the single file version (also pass a dir for zipping?)
const imageWithData = create({ image, data, contentType })

const res = parse(imageWithData)

console.log(res.toString())
