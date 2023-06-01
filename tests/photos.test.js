/**
 * 
 */

const fs = require("fs");

const auth = require("../lib/authenticate.js");
const photos = require("../lib/photos.js");

const manifest = require("./manifest.test.json");


beforeAll(async ()=> {
  const token = await auth.getAccessToken();
  await photos.initPhotoAPI(token);
});


// User Manifest
test("Validate user manifest file exists", async () => {
  const response = await photos.validateManfiest();
  expect(response.success).toBe(true);
});


// Google Photos API
test("Retrieve list user albums", async() => {
  const albums = await photos.getUserAlbums();
  expect(albums.length).toBeGreaterThan(0);
});

test("Get user albums to backup", async ()=> {
  const albums = await photos.getBackupAlbums();
  await expect(albums.length).toBeGreaterThan(0);
});
