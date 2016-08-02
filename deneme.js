/**
 * Created by alp on 02.08.2016.
 */
var spotify = require('spotify');

console.log("dsa" + "\n" + "dsa")

spotify.search({ type: 'track', query: 'dancing in the moonlight' }, function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }

    var result = [];
    var items =data.tracks.items;
    items.forEach(function (row) {
        var album    = row.album.name;
        var image    = row.album.images[0].url;
        var artist   = row.artists[0].name;
        var duration = row.duration_ms;
        var url      = row.external_urls.spotify
        var element = {'album' : album,'image' :image , 'artist' : artist, 'duration' : duration, 'url' : url};
        result.push(element);
    })
    
});