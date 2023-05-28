/**
 * 
 */
const fs = require("fs");
const Path = require('path');
const https = require("https");
const axios = require("axios");

const GooglePhotos = require('googlephotos');

const IMAGE_DIRECTORY = "./images"
const USER_MANIFEST_FILE = "./user.manifest.json";
const API_PAGE_SIZE = 1;
let photos;


const initPhotoAPI = (access_token) => {
  photos = new GooglePhotos(access_token);

  return new Promise(resolve => {
    resolve();
  })
};

const getUserManifest = () => {
  return JSON.parse(fs.readFileSync(USER_MANIFEST_FILE));
};

const getBackupAlbums = () => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(USER_MANIFEST_FILE)) {
      reject({
        message: 'ERR-PHOTO-001: User manifest file does not exist'
      })
    };

    resolve(
      getUserManifest().albums
    );
  });
};

const createAlbumDirectory = albumName => {
  fs.mkdir(`${IMAGE_DIRECTORY}/${albumName}`, ()=> {
    console.log(`PHOTO: Created new directory for album "${albumName}"`)
  });
};

  // // Retrieve photos via Google Photos API.
  // photos.mediaItems.search(id, API_PAGE_SIZE)
  // .then(response => {

  //   response.mediaItems.forEach(async photo => {
  //     const url = `${photo.baseUrl}=d`;
  //     const path = Path.resolve(`${__dirname}/..`, `images/${name}`, photo.filename);
  //     const writer = fs.createWriteStream(path);

  //     // Download image to album directory.
  //     const res = await axios({
  //       url,
  //       method: 'GET',
  //       responseType: 'stream'
  //     })
  //     res.data.pipe(writer)

  //     return new Promise((resolve, reject) => {
  //       writer.on('finish', resolve)
  //       writer.on('error', reject)
  //     });
  //   });

  //   // console.log(response.nextPageToken);

  // });


const getUserAlbums = () => {
  return new Promise(async (resolve, reject) => {
    const response = await photos.albums.list();
    resolve(response.albums);
  });
};

module.exports = {
  initPhotoAPI: initPhotoAPI,
  getBackupAlbums: getBackupAlbums,
  createAlbumDirectory: createAlbumDirectory,
  getUserAlbums: getUserAlbums
};