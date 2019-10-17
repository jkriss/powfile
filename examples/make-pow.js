const { create, parse } = require('../index')
const fs = require('fs')
const path = require('path')

const image = fs.readFileSync(path.join(__dirname, 'floppy.png'))
const data = Buffer.from('Hello, world!')
const contentType = 'text/plain'

const run = async () => {
  // the single file version
  const imageWithData = await create({ image, data, contentType })

  const res = await parse(imageWithData)

  console.log(res.toString())
}

run()

