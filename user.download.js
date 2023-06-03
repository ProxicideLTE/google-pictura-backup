/**
 * @file user.download.js
 * 
 * This file downloads the photo files for the albums defined 
 * in user.manifest.json file.
 * 
 */

const authentication = require("./lib/authenticate.js");
const photos = require("./lib/photos.js");


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
    console.log(`BACKUP: Found ${albums.length} ${albums.length > 1 ? "albums": "album"} to backup`);
  
    // Create album directory and download album photos in the directory.
    let albumDirectoryPromises = [];
    let albumPhotoPromises = [];
    albums.forEach(async album => {
      albumDirectoryPromises.push(photos.createAlbumDirectory(album.name));
      albumPhotoPromises.push(photos.downloadAlbumPhotos(album));
    });

    await Promise.all(albumDirectoryPromises);
    await Promise.all(albumPhotoPromises);
  }

  catch(err) {
    console.log(`${err.message}`);
  }
};

main();