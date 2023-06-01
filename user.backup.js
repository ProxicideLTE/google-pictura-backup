/**
 * 
 */
const authentication = require("./lib/authenticate.js");
const photos = require("./lib/photos.js");

const main  = async () => {
  try {
    const response = await photos.validateManfiest();
    if (!response.success) {
      return;
    }
    
    const access_token = await authentication.getAccessToken();
    await photos.initPhotoAPI(access_token);
  
    const albums = await photos.getBackupAlbums();
    console.log(`Found ${albums.length} ${albums.length > 1 ? "albums": "album"} to backup.`);
  
    await albums.forEach(album => {
      console.log(`Backing up album "${album.name}"`);

      photos.createAlbumDirectory(album.name);
      photos.downloadAlbumPhotos(album);
    });
  }

  catch(err) {
    console.log(err.message);
  }
};

main();