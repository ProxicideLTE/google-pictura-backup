/**
 * 
 */
const authentication = require("./lib/authenticate.js");
const photos = require("./lib/photos.js");

const main  = async () => {
  const access_token = await authentication.getAccessToken();

  await photos.initPhotoAPI(access_token);

  const albums = await photos.getBackupAlbums();
  console.log(`Found ${albums.length} albums to backup`);

  await albums.forEach(album => {
    photos.createAlbumDirectory(album.name)
  });

};

main();