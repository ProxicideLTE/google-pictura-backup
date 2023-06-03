
const fs = require("fs");
const fse = require('fs-extra');

const manifest = require('./user.manifest.json');

const albumName = manifest.albums[0].name;
const srcDir = `./images/${albumName}`;
const destDir = "Z:/Art/Catalog/";

// Create directory.
fs.mkdir(`${destDir}/${albumName}`, (error)=> {
  
  // Copies contents inside directory, but not the directory itself...
  fse.copySync(srcDir, `${destDir}/${albumName}`, {  
    overwrite: true
  });

});

