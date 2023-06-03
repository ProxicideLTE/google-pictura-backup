/**
 * @file schema.manifest.js
 * 
 * Defines the JSON schema for the user.manifest.json file.
 * 
 */

module.exports = {
  "albums": [
    {
      "id": String,
      "name": String,
      "directories": Array
    }
  ]
}