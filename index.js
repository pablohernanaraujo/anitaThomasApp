const Express = require('express');
const app = Express();

const fs = require('fs');
const {promisify} = require('util');
const readFile = promisify(fs.readFile);
const im = require('gm').subClass({imageMagick: true});
const thumbSize = 16;


const verPage = async function (req, res, end, html) {
  let filepath = req.url;
  if(filepath.endsWith('/'))
    filepath += html;
  if(filepath.endsWith('fashion'))
    filepath = html;
  if(filepath.endsWith('teens'))
    filepath = html;
  let buffer = await readFile('./static/'+filepath);
  let content = buffer.toString();
  let newContent = await Promise.all(
    content
      .split(/(<sc-img[^>]+><\/sc-img>)/)
      .map(async item => {
        if(!item.startsWith('<sc-img'))
          return item;
        let src = /src="([^"]+)"/.exec(item)[1];
        let img = im('./static' + src);
        let sizeFunc = promisify(img.size.bind(img));
        let {width, height} = await sizeFunc();
        let thumbFunc = promisify(img.resize(thumbSize, thumbSize).toBuffer.bind(img));
        let thumb = await thumbFunc('PNG');
        let thumbURL = `data:image/png;base64,${thumb.toString('base64')}`;
        return item.replace('></sc-img>', `style="padding-top: ${height/width*100}%; background-image: url(${thumbURL});"></sc-img>`);
      })
    );
  res.send(newContent.join(''));
}
app.get('/', (req, res) => {
  verPage(req,res, '/', 'index.html')
});

app.get('/fashion', (req, res) => {
  verPage(req,res, '/fashion', 'fashion.html')
});

app.get('/teens', (req, res) => {
  verPage(req,res, '/teens', 'teens.html')
});
// app.get('/', function(req, res) {
//   res.send('im the home page');
// });
// app.get('/', async (req, res) => {
//   let filepath = req.url;
//   if(filepath.endsWith('/fashion'))
//     filepath += 'fashion.html';
//   let buffer = await readFile('./static'+filepath);
//   let content = buffer.toString();
//   let newContent = await Promise.all(
//     content
//       .split(/(<sc-img[^>]+><\/sc-img>)/)
//       .map(async item => {
//         if(!item.startsWith('<sc-img'))
//           return item;
//         let src = /src="([^"]+)"/.exec(item)[1];
//         let img = im('./static' + src);
//         let sizeFunc = promisify(img.size.bind(img));
//         let {width, height} = await sizeFunc();
//         let thumbFunc = promisify(img.resize(thumbSize, thumbSize).toBuffer.bind(img));
//         let thumb = await thumbFunc('PNG');
//         let thumbURL = `data:image/png;base64,${thumb.toString('base64')}`;
//         return item.replace('></sc-img>', `style="padding-top: ${height/width*100}%; background-image: url(${thumbURL});"></sc-img>`);
//       })
//     );
//   res.send(newContent.join(''));
// });

app.get('/about', function(req, res) {
  res.send('im the about page');
});

app.use(Express.static('static'));
app.listen(process.env.PORT || 5000);
