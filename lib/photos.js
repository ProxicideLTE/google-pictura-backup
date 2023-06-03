/**
 * @file photos.js
 * 
 * File to make API calls to Google Photos to retrieve user albums and photos.
 * 
 * Additional reading:
 * https://developers.google.com/photos/library/reference/rest
 * https://github.com/roopakv/google-photos
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

const API_PHOTO_PAGE_LIMIT = 2;
const API_ALBUM_PAGE_LIMIT = 50;
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
  return new Promise((resolve, reject) => {
    fs.mkdir(`${IMAGE_DIRECTORY}/${albumName}`, (error)=> {
  
      if (error) {
        reject({
          success: false
        });
      } 

      console.log(`PHOTO: Created new directory for album "${albumName}"`);
      resolve({
        success: true
      });
    });
  })
};

const downloadAlbumPhotos = (album) => {
  console.log(`PHOTO: Downloading photos for album "${album.name}"`);

  const getAlbumPhotos = async (nextPageToken = null) => {
    const albumPhotos = await photos.mediaItems.search(album.id, API_PHOTO_PAGE_LIMIT, nextPageToken);
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
      await getAlbumPhotos(albumPhotos.nextPageToken);
    }
    else {
      return;
    }
  };

  return new Promise(async (resolve, reject) => {
    try {
      await getAlbumPhotos();
    }
    catch(error) {
      console.log(error);
      reject({
        success: false
      })
    }

    resolve({
      success: true
    });
  });
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

const getUserAlbums = async () => {
  let albums = [];

  const getUserOwnedAlbums = async (nextPageToken = null) => {
    const response = await photos.albums.list(API_ALBUM_PAGE_LIMIT, nextPageToken);
  
    response.albums.forEach(album => {
      delete album.coverPhotoBaseUrl;
      delete album.coverPhotoMediaItemId;
      delete album.productUrl;
  
      albums.push(album);
    });
  
    if (response.nextPageToken) {
      await getUserOwnedAlbums(response.nextPageToken);
    }
    else {
      return;
    }
  };

  try {
    await getUserOwnedAlbums();
  }
  catch(error) {
    console.log(error);
  }

  return albums;
};


module.exports = {
  initPhotoAPI: initPhotoAPI,
  validateManfiest: validateManfiest,
  getBackupAlbums: getBackupAlbums,
  createAlbumDirectory: createAlbumDirectory,
  downloadAlbumPhotos: downloadAlbumPhotos,
  getUserAlbums: getUserAlbums
};