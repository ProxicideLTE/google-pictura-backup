/**
 * @file photo.test.js
 * 
 * Unit tests for the Google Photos API to retrieve albums and photos.
 * 
 */

const fs = require("fs");

const auth = require("../lib/authenticate.js");
const photos = require("../lib/photos.js");

const manifest = require("./manifest.test.json");
const TEST_ALBUM_DIRECTORY = manifest.albums[0].name;


beforeAll(async ()=> {
  const token = await auth.getAccessToken();
  await photos.initPhotoAPI(token);
});


// User Manifest.
test("Validate user manifest file exists", async () => {
  const response = await photos.validateManfiest();
  expect(response.success).toBe(true);
});

test("Users backup albums to be defined", async ()=> {
  const albums = await photos.getBackupAlbums();
  await expect(albums.length).toBeGreaterThan(0);
});


// File management
test("Create album directory is successful", async ()=> {
  const albums = await photos.createAlbumDirectory(`${TEST_ALBUM_DIRECTORY}`);
  await expect(albums.success).toBe(true);
});



// Google Photos API
test("Retrieve list user albums", async () => {
  const albums = await photos.getUserAlbums();
  expect(albums.length).toBeGreaterThan(0);
});

test("Download album photos", async () => {
  const testAlbum = manifest.albums[0];
  const response = await photos.downloadAlbumPhotos(testAlbum);
  expect(response.success).toBe(true);
});



afterAll(async () => {
  fs.rm(`./images/${TEST_ALBUM_DIRECTORY}`, { recursive: true, force: true }, () => {
    
  });
});