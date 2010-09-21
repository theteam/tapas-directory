magnet.person = function(p) {
	localPerson = this;
	this.element = $(p);
	this.id = $(p).attr('id');
	this.img = $(p).find('.front img').attr('src');
	this.fullName = $(p).find('.front h2.name').text();
	this.searchableFullName = this.fullName.toLowerCase();
//	this.firstName = this.fullName.substr(0, this.fullName.lastIndexOf(' ')
//	this.lastName = this.fullName.substr(this.fullName.lastIndexOf(' '))
	this.skills = new Array();
	$(p).find('ul.skills li').each(function() {
		localPerson.skills.push($(this).text());
	});
	this.bio = $(p).find('div.bio').text();
	this.department = $(p).find('h3.department').text();
	this.company = $(p).find('h3.company').text();
	
	// if (console) {
	// 		console.log('FullName: ' + this.fullName);
	// 		console.log('Id: ' + this.id);
	// 		console.log('Skills: ' + this.skills.join(', '));
	// 		console.log('Department: ' + this.department);
	// 		console.log('Company: ' + this.company);
	// 		console.log('===============================================');
	// 	}
};