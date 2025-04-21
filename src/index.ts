import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  const fileModel = path.join(__dirname, '../model');

  fs.readdir(fileModel, (err, files) => {

    const listHtml = files.map(file => {
      const configFile = fs.readFileSync(`./model/${file}/config.json`, 'utf8');
      const configFileJson = JSON.parse(configFile);

      return `<a href="/model/${file}"><li>${configFileJson.name}</li></a>`;
    }).join('\n');

    const pageHtml = path.join(__dirname, '../public/index.html');
    
    fs.readFile(pageHtml, 'utf8', (err, data) => {

      const page = data.replace('{{id}}', listHtml);
      res.send(page);
    });
  });
});

app.get('/model/:id', (req, res) => {
  const id = req.params.id;
  const filePath = path.join(__dirname, `../model/${id}/index.html`)

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (!fs.existsSync(filePath)) {
      return res.status(500).sendFile(path.join(__dirname, '../public/notfound.html'));
    }

    const page = data.replace('{{id}}', id);
    res.send(page);
  });
});

/*
app.get('/dow', (req, res) => {
    const filepath = path.join(__dirname, '../File/test.txt');
    res.download(filepath, 'test.txt');
});
*/

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
