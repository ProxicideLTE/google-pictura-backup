/**
 * @file user.backup.js
 * 
 * This file download and backup the photo files for the albums defined 
 * in user.manifest.json file.
 * 
 */

const fs = require("fs");
const fse = require('fs-extra');
const authentication = require("./lib/authenticate.js");
const photos = require("./lib/photos.js");


const backupAlbums = () => {
  const albums = photos.getUserManifest().albums;

  albums.forEach(album => {

    album.directories.forEach(path => {
      // Create directory.
      fs.mkdir(`${path}/${album.name}`, (error)=> {

        // Move files to new directory.
        fse.copySync(`./images/${album.name}`, `${path}/${album.name}`, {  
          overwrite: true
        });

      }); 

    });

  });

};

const main = async () => {
  try {
    // Validate user.manifest.json file.
    const response = await photos.validateManfiest();
    if (!response.success) return;
  
    // Authenicate to Google Photos API.
    const access_token = await authentication.getAccessToken();
    await photos.initPhotoAPI(access_token);
  
    // Retrieve the list of albums to backup.
    const albums = await photos.getBackupAlbums();
    console.log(`Found ${albums.length} ${albums.length > 1 ? "albums": "album"} to backup`);
  
    // Create album directory and download album photos in the directory.
    let albumDirectoryPromises = [];
    let albumPhotoPromises = [];
    albums.forEach(async album => {
      albumDirectoryPromises.push(photos.createAlbumDirectory(album.name));
      albumPhotoPromises.push(photos.downloadAlbumPhotos(album));
    });

    await Promise.all(albumDirectoryPromises);
    await Promise.all(albumPhotoPromises);

    // Move albums defined in the manifest file.
    backupAlbums();
  }

  catch(err) {
    console.log(err.message);
  }
};

main();