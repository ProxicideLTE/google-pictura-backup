/**
 * @file user.backup.js
 * 
 * This file download and backup the photo files for the albums defined 
 * in user.manifest.json file.
 * 
 */

const fs = require("fs");
const fse = require('fs-extra');
const photos = require("./lib/photos.js");


const main = () => {
  const albums = photos.getUserManifest().albums;

  albums.forEach(album => {

    album.directories.forEach(path => {
      // Create directory.
      fs.mkdir(`${path}/${album.name}`, (error)=> {

        // Move photo files to new directory.
        fse.copySync(`./images/${album.name}`, `${path}/${album.name}`, {  
          overwrite: true
        });

      }); 

    });

  });

};

main();