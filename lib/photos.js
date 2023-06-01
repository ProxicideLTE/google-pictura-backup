/**
 * 
 */
const fs = require("fs");
const Path = require('path');
const https = require('https');
const validate = require("validate-fields")();
const manifestSchema = require("./schema.manifest");

const GooglePhotos = require('googlephotos');

const IMAGE_DIRECTORY = "./images"
const USER_MANIFEST_FILE = "./user.manifest.json";

const API_PAGESIZE_LIMIT = 2;
let photos;

const initPhotoAPI = (access_token) => {
  photos = new GooglePhotos(access_token);

  return new Promise(resolve => {
    resolve();
  })
};

const validateManfiest = () => {
  let response = {};

  return new Promise((resolve, reject) => {
    // File doesn't exist.
    if (!fs.existsSync(USER_MANIFEST_FILE)) {
      response.success = false;
      response.message = "ERR-PHOTO-001: User manifest JSON file does not exist";
    }
  
    else if (!validate(manifestSchema, getUserManifest())) {
      response.success = false;
      response.message = "ERR-PHOTO-002: User manifest JSON is invalid";
    }

    else {
      response.success = true;
    }


    if (!response.success) {
      reject(response);
    }

    else {
      resolve(response)
    }

  });
};

const getUserManifest = () => {
  return JSON.parse(fs.readFileSync(USER_MANIFEST_FILE));
};

const getBackupAlbums = () => {
  return new Promise((resolve) => {
    resolve(
      getUserManifest().albums
    );
  });
};

const createAlbumDirectory = albumName => {
  fs.mkdir(`${IMAGE_DIRECTORY}/${albumName}`, ()=> {
    // console.log(`PHOTO: Created new directory for album "${albumName}"`);
  });
};

const downloadAlbumPhotos = async (album, nextPageToken = null) => {

  const albumPhotos = await photos.mediaItems.search(album.id, API_PAGESIZE_LIMIT, nextPageToken);
  let promises = [];

  albumPhotos.mediaItems.forEach(async photo => {
    promises.push(downloadPhoto(photo, album.name));
  });
  
  await Promise.all(promises);

  /**
   * Recursion to loop through the album photos since there is a limit on the 
   * number of photos that can be returned in the API
   * Source: https://developers.google.com/photos/library/reference/rest/v1/mediaItems/search
   */
  if (albumPhotos.nextPageToken) {
    await downloadAlbumPhotos(album, albumPhotos.nextPageToken);
  }
  else {
    return;
  }
};

const downloadPhoto = async (photo, albumName) => {

  const path = Path.resolve(`${__dirname}/..`, `images/${albumName}`, photo.filename);
  const writer = fs.createWriteStream(path);

  /**
   * Base URL gives a lower resolution of the original picture. So 
   * append "=d" to download the orginal source of the photo. However
   * this apparently removes some metadata for the photo file.
   * 
   * Source: https://stackoverflow.com/questions/54782846/how-to-download-an-original-image-or-video-with-the-baseurl-of-google-photos-api
   */
  const url = `${photo.baseUrl}=d`; 

  https.get(url, response => {
    response.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        writer.close();
        resolve();
      });
      writer.on('error', () => {
        writer.close();
        reject();
      });
    });

  });
};

const getUserAlbums = () => {
  return new Promise(async (resolve, reject) => {
    const response = await photos.albums.list();

    let albumList = [];
    response.albums.forEach(album => {
      delete album.coverPhotoBaseUrl;
      delete album.coverPhotoMediaItemId;
      delete album.productUrl;

      albumList.push(album);
    });

    resolve(albumList);
  });
};

module.exports = {
  initPhotoAPI: initPhotoAPI,
  validateManfiest: validateManfiest,
  getBackupAlbums: getBackupAlbums,
  createAlbumDirectory: createAlbumDirectory,
  downloadAlbumPhotos: downloadAlbumPhotos,
  getUserAlbums: getUserAlbums
};