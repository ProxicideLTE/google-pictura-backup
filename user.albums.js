/**
 * 
 */
const authentication = require("./lib/authenticate.js");
const photos = require("./lib/photos.js");


const main = async () => {
  const access_token = await authentication.getAccessToken();
  
  await photos.initPhotoAPI(access_token);
  const userAlbums = await photos.getUserAlbums();
  console.table(userAlbums);
};

main();