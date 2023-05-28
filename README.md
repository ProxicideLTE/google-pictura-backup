# Google Pictura Backup

This repo is intended to download and backup photos from certain albums in [Google Photos](https://photos.google.com/) using the [API](https://developers.google.com/photos). Then take those files and store them in specific directories on your machine or even on network-attached storage (NAS) drives. This is help automate the [3-2-1 backup strategy](https://www.backblaze.com/blog/the-3-2-1-backup-strategy/).


Finally, "Pictura" is latin for "Picture".

# Requirements
- an active Google account using Google Photos
- node v14.*
- npm v6.14.*

# Installation

## Node
Simply run the following command in your terminal to install all dependencies:
```
npm install
```

# Setup

## Google Cloud Console
1. Create a new project in Google Photos Library API via the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable Photos Library API in your new project
3. Create credentials (OAuth 2.0 client ID) and download the JSON file
4. Store the JSON file in this repo and rename file to `credentials.json` (part of .gitignore - will never be pushed to repo)

## user.manifest.json
Create a JSON file called `user.manifest.json` and store it in the root of this repo.

```json
{
  "albums": [
    {
      "id": "<<album ID>>",
      "name": "<<album name>>"
    }
  ],
  "directories": [
    "<<path_to_directory_1>>",
    "<<path_to_directory_2>>",
  ]
}
```

# Usage
WIP

## Albums
```
npm run albums
```

## Backup
```
npm run backup
```