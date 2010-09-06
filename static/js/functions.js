/* 

  Songstalkr JS lib
  Author: Roel van der Ven / Soundcloud
  E-mail: roel@soundcloud.com
  Date: 05-09-2010

*/

$.fn.clearOnFocus = function () {
  return this.focus(function () {
    if (this.value == this.defaultValue) {
      this.value = ""
    }
  }).blur(function () {
    if (!this.value.length) {
      this.value = this.defaultValue
    }
  })
};


$(function() {
  var lastfm_api_key = '3907fcb3081064975fec30a3225e3288';

  $('.clearfocus').clearOnFocus();

  // LocalStorage stuff

  if (!localStorage.getItem('lastfm_users')) {
    var localusers = new Array();
  } else {
    var localusers = localStorage.getItem('lastfm_users');
    console.log('Page loaded with LocalStorage: '+ localusers);
  }

  $('#adduser').submit(function() {
    $('#newuser').val().push(localusers);
    console.log('LocalStorage: ' + localusers);
    localStorage.setItem('lastfm_users', localusers);
    return false;
  });

  // to reset
  // localStorage.clear();

  function searchTrack(song, friendobject) {
    console.log('searching Spotify for "' + song + '" ...');

    $.ajax({
      type: 'GET',
      url: 'http://ws.spotify.com/search/1/track?q=' + song,
      processData: true,
      dataType: 'xml',
      success: function(spotiresult) {
        var spotilink = $(spotiresult).find('track').first().attr('href');
        console.log(spotilink);
        friendobject.find('.song').attr('href', spotilink);
        return false;
      }
    });
    return false;
  };

  function getTrack(api_key, username, song, friendobject) {
    console.log('Pinging Last.fm for "' + username.html() + '" ... ');
		$.ajax({
			type: 'GET',
			processData: true,
			url: 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user='+ username.html() +'&api_key='+ api_key +'&format=json&limit=1',
			dataType: 'jsonp',
			success: function(results) {
			  var track = results.recenttracks.track;
			  var artist = results.recenttracks.track.artist['#text'];
        console.log('Song: '+ track.name);
        song.html(artist + ' - ' + track.name);
				return searchTrack(track.name, friendobject);
			}
		});
		return false;
  };
  
  $('.friends li').each(function() {
    var username = $(this).find('.username');
    var song = $(this).find('.song');
    getTrack(lastfm_api_key, username, song, $(this));
  });
});