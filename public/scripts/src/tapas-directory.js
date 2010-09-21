$(document).ready(function() {
	$.ajax({
		url:'/users.json',
		dataType:'json',
		success: function(people){
			for (var i = 0; i < people.length; i++){
				 $('div#people').prepend('<div class="person" id="' + people[i].username + '">' + 
						'<div class="front">' + 
							'<h2 class="name">' + people[i].full_name + '</h2>' +  
							'<img src="images/avatar_blank.png" class="back">' +
							'<img src="' + people[i].image_uri + '" class="front">' + 
						'</div>' +  
						'<div class="back">' + 
							'<h2>' + people[i].full_name + '</h2>' + 
							'<h3 class="company">' + people[i].company + '</h3>' + 
							'<h3 class="department">' + people[i].department + '</h3>' +
							'<div class="bio">' + people[i].bio + '</div>' + 
							'<a href="/users/' + people[i].username + '/edit">[edit]</a>' + 
						'</div>' + 
				    '</div>');
				
			}
			magnet.init();
		}, failure: function(){
			alert('whopps');
		}
	});
});