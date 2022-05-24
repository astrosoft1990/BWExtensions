const fs = require('fs')
const path = require('path')

let src_dir = path.join(__dirname, 'specs.json')
let dst_dir = path.join(__dirname, 'specs_escape.json')
fs.readFile(src_dir, 'utf8', (err, data) => {
  if (err) {
    console.log(err)
    return
  }

  let str = encodeURI(JSON.stringify(JSON.parse(data)));

  fs.writeFile(dst_dir, str, 'utf8', (err) => {
     console.log('写入成功', err)

    fs.readFile(dst_dir, 'utf8', (err, data) => {
        let str = JSON.stringify(JSON.parse(decodeURI(data)));
        console.log(str);
    });
  });
});
