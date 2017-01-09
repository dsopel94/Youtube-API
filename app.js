var state = {
	settings: {
		url: 'https://www.googleapis.com/youtube/v3/search',
		part: 'snippet',
		key: 'AIzaSyD8KZweU5rlFzztWHLOsbhJTah9083ue8I',
		q: '',
	},
 	results: []
}

function main() {
	function renderData() {
			var resultsHTML = state.results.map(function(item) {
			var thumbnail = item.snippet.thumbnails.medium.url;
	        var id = item.id.videoId;
	        return ('<li>'+
	        	'<img id="'+ id +'" src="' + thumbnail + '">'+
	        	'<span id="' + item.snippet.channelId + '">' + item.snippet.channelTitle + '</span>' +
	        	'</li>');
		});
	$('.results ul').html(resultsHTML);
	}
	function renderButtons() {
		if (state.nextPageToken) {
			$('.forward').removeClass('hidden');
		} else { 
			$('.forward').addClass('hidden');
		}
		if (state.prevPageToken) {
			$('.backward').removeClass('hidden');
		} else { 
			$('.backward').addClass('hidden');
		}
	}

	function getDatafromAPI(channelId) {
		if (channelId) {
			state.settings['channelId'] = channelId;
		}
		$.getJSON(state.settings.url, state.settings, function(response){
			state.results = response.items;
			state['nextPageToken'] = response.nextPageToken;
			state['prevPageToken'] = response.prevPageToken;
			renderButtons();
			renderData();
		});
	}
	function getMorefromChannel() {
		$('.results').on('click', 'span', function() {
			var channelId = $(this).attr('id')
			getDatafromAPI(channelId);
		});
	}
	function playVideo() {
		$('.results').on('click', 'img', function() {
			$('.video-wrapper').html('<iframe width="560" height="315" src="https://www.youtube.com/embed/' + $(this).attr('id') + '" frameborder="0" autoplay="true" allowfullscreen></iframe>')
		}); 
	}

	function bindNavButtons() {
		$('.backward').on('click',function() {
			if (state.prevPageToken) {
				state.settings.pageToken = state.prevPageToken;
				getDatafromAPI();
			}
		});
		$('.forward').on('click',function() {
			if (state.nextPageToken) {
				state.settings.pageToken = state.nextPageToken;
				getDatafromAPI();
			}
		});
		
	}

	function init() {
		$('form').on('submit', function(event) {
			event.preventDefault();
			state.settings.q = $('.searchInput').val();
			console.log(state);
			getDatafromAPI();
			$('.nav').removeClass("hidden");
			playVideo();
			getMorefromChannel();
			bindNavButtons();
		});
	}
	init();
}


$(document).ready(main);