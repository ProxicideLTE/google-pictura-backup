# Google Pictura Backup

This repo is intended to download and backup photos from certain albums in [Google Photos](https://photos.google.com/) using the [API](https://developers.google.com/photos). Then take those files and store them in specific directories on your machine or even on network-attached storage (NAS) drives. This is to help automate part of the [3-2-1 backup strategy](https://www.backblaze.com/blog/the-3-2-1-backup-strategy/) without doing all the manual work.


Finally, "Pictura" is latin for "Picture".

# Requirements
- an active Google account using Google Photos
- node v14-16
- npm v6-8

# Installation

## Node
Simply run the following command in your terminal to install all dependencies:
```
npm install
```

# Project Setup

## Google Cloud Console
1. Create a new project in Google Photos Library API via the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable Photos Library API in your new project
3. Create credentials (OAuth 2.0 client ID) and download the JSON file
4. Store the JSON file in this repo and rename file to `credentials.json` (part of .gitignore - will never be pushed to repo)

## user.manifest.json
Create a JSON file called `user.manifest.json` and store it in the root of this repo. This file will contain the list of albums you want to download and backup.

Example:
```json
{
  "albums": [
    {
      "id": "<<album ID>>",
      "name": "<<album name>>",
      "directories": [
        "<<path_to_directory_1>>",
        "<<path_to_directory_2>>",
      ]      
    }
  ]
}
```

### Album IDs
Refer to the user albums command below to see the album IDs you need for this manifest file.

### Album Name
**Folder name** that the album photos will be stored in. Name doesn't need to match the album name in Google Photos.

e.g. Drawings

### Directories
Array of directories/paths the photos will be copied to. Can include network paths.

e.g. "Z:/Art/Catalog/"

# Usage

## Get User Albums
To see a list of albums in your Google Photos account, run the following command:
```
npm run albums
```

After the output you can see the details for each album you need to populate the `user.manifest.json` file.

## Download Album Photos
To download all the photos for each album in the `user.manifest.json` file. Run the following command:
```
npm run download
```

Each album will be stored in the `images` directory in it's own folder defined in the `user.manifest.json` file.

## Backup
To copy and the local photo albums in the `images` directory. Run the following command:
```
npm run backup
```