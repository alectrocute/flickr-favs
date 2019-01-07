// nodejs dependencies
var Flickr = require('flickr-sdk');
const fs = require('fs');
const download = require('image-downloader');
var param = process.argv[2];

// CONFIGURATION
const apiKey = "";
const favUser = "";
const destination = "/home/photos";

function getFlickrFavorites(pageNum) {
    var flickr = new Flickr(apiKey);
    // get public list of favorites
    flickr
        .favorites
        .getPublicList({user_id: favUser, page: pageNum})
        .then(function (res) {
            var n = res.body;
            var _s = n.photos.photo;
            var z_indUrl;
            var b = 0;

            // for every photo in list
            for (var z = 0; z < n.photos.photo.length; z++) {

                // single photo id to identify photos.getSizes
                tempPhotoId = _s[z]['id'];

                // get sizes
                flickr
                    .photos
                    .getSizes({photo_id: tempPhotoId})
                    .then(function (subres, tempPhotoId) {
                        console.log("(DL/ALL " + b + "/" + n.photos.photo.length + ")");

                        // prepare for download
                        z_indUrl = JSON
                            .stringify(subres.body.sizes.size[11].source)
                            .replace(/['"]+/g, '');
                        dlUrl = z_indUrl.replace("staticflickr", "static.flickr");
                        console.log("Original photo located: " + dlUrl);
                        b = b + 1;
                        b_name = "photo" + b + ".jpg";

                        // download the file to local
                        var options = {
                            url: dlUrl,
                            dest: destination;
                        }

                        // actually download it
                        download
                            .image(options)
                            .then(({filename, image}) => {
                                console.log('File saved to ', filename)
                            })
                            .catch((err) => {
                                console.error(err)
                            })

                            // error if size not found, let's downgrade size
                    })
                    .catch(function (err) {
                        console.log('Failed to locate original photo.');
                    });
            }
        })
        .catch(function (err) {
            console.log("Error finding user.");
        });
}

getFlickrFavorites(param);
