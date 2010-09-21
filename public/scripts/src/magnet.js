var magnet = {};
magnet.data = {};

magnet.filter = function() {
	this.byName = magnet_filter_byName;
	this.byCompany = magnet_filter_byCompany;
	this.byDepartment = magnet_filter_byDepartment;
	this.bySkill = magnet_filter_bySkill;
};

function magnet_filter_byName(name) {
	var peeps = [];
	
	for (var i = 0;i < magnet.data.people.length;i++) {
		if (magnet.data.people[i].searchableFullName.indexOf(name) > -1) {
			peeps.push(magnet.data.people[i].id);
		}
	};
	
	return peeps;
};

function magnet_filter_byCompany(name) {
	var peeps = [];
	
	for (var i = 0;i < magnet.data.people.length;i++) {
		if (magnet.data.people[i].company == name) {
			peeps.push(magnet.data.people[i].id);
		}
	}
	
	return peeps;		
};

function magnet_filter_byDepartment(name) {
	var peeps = [];
	
	for (var i = 0;i < magnet.data.people.length;i++) {
		if (magnet.data.people[i].department == name) {
			peeps.push(magnet.data.people[i].id);
		}
	}
	
	return peeps;		
}

function magnet_filter_bySkill(skills) {
	var peeps = [];
	
	for (var i = 0;i < magnet.data.people.length;i++) {
		var j = magnet.data.people[i].skills.length;
		
		while (j--) {
			if (skills.contains(magnet.data.people[i].skills[j])) {
				peeps.push(magnet.data.people[i].id);
				break;
			}
		}
	}
	
	return peeps;		
};

magnet.init = function() {
	magnet.buildReference();
	this.filter = new magnet.filter();
	
	supportsTouch = ('createTouch' in document);
	
	this.reBind = function(ids) {
		var counter = 0;

		if (ids.length > 0) {
			$('div.person').each(function() {
				if (!ids.contains($(this).attr('id'))) {
					$(this).addClass('miss');
				}
				else {
					$(this).removeClass('miss');
					counter++;			
				}
			});
		} else {
			$('div.person').each(function() {
				$(this).addClass('miss');
			});
		}

		magnet.updateCount(ids.length);
	};
	
	this.updateCount = function(i) {
		if (arguments.length == 0) {
			i = magnet.data.people.length;
		}
	
		var str = '';
		if (i < 1) {
			str = 'Nobody to see here';
		} else if (i == 1) {
			str = 'Just this person found';
		} else if (i == 2) {
			str = 'Only a couple found';
		} else if (i == 3) {
			str = 'Three\'s a crowd';
		} else {
			str = 'Found ' + i + ' people';
		}
	
		$('#people-count').text(str);
	};
	
	this.showAll = function() {
		$('div.person').each(function() {
			$(this).removeClass('miss');
		});
		
		$('#filters select').each(function() {
			this.selectedIndex = 0;
		});
		
		$('#filters input[type=text]').each(function() {
			this.value = '';
		});
		
		magnet.updateCount();
	};
	
	magnet.events();
};



// build a query-able data object.
magnet.buildReference = function() {
	magnet.data['people'] = [];
	magnet.data['skills'] = [];
	magnet.data['departments'] = [];
	magnet.data['companies'] = [];
	
	$('div.person').each(function() {
		var person = new magnet.person(this);
		magnet.data.people.push(person);
		
		for (var i = 0;i < person.skills.length;i++) {
			if (!magnet.data.skills.contains(person.skills[i])) {
				magnet.data.skills.push(person.skills[i]);
			}
		}
		
		if (person.department.length > 0 && !magnet.data.departments.contains(person.department)) {
			magnet.data.departments.push(person.department);
		}
		
		if (person.company.length > 0 && !magnet.data.companies.contains(person.company)) {
			magnet.data.companies.push(person.company);
		}
	});
	
	magnet.data.skills.sort();
	magnet.data.departments.sort();
	magnet.data.companies.sort();
	
	console.log('departments = ' + magnet.data.departments.join(', '));
	console.log('companies = ' + magnet.data.companies.join(', '));
};

// register event handlers.
magnet.events = function() {
	//toggle the filter ui.
	$("h1#title").click(function(){
		$("#filters").toggleClass('open');
	});
	
	$('#lightbox').click(function(){
		$('#wrapper').find('div#lightbox').empty().parent().removeClass('lightbox');	
	});

	$("div.person").bind('click', function(ev){
		var person = $(this);
		var html = $(this).find("div.back").html();
		
		if (person.is('.flipped')) {
			setTimeout(function(){person.removeClass('flipped');},1000);
			$('#wrapper').find('div#lightbox').html(html).parent().addClass('lightbox');
		}
		else {
			if (!$('#wrapper').is('.lightbox')) person.addClass('flipped');
			$('#wrapper').find('div#lightbox').empty().parent().removeClass('lightbox');
		}
	});
	
	var skills = '<option></option>';
	for (var i = 0;i < magnet.data.skills.length;i++) {
		skills += '<option>' + magnet.data.skills[i] + '</option>';
	}
	$('#filters #skills').append(skills);
	
	if (magnet.data.departments.length > 0) {
		var departments = '<option></option>';
		for (var i = 0;i < magnet.data.departments.length;i++) {
			departments += '<option>' + magnet.data.departments[i] + '</option>';
		}
		$('#filters #department').append(departments);
	}
	else {
		$('#filters #department').hide();
	}

	if (magnet.data.companies.length > 0) {
		var companies = '<option></option>';
		for (var i = 0;i < magnet.data.companies.length;i++) {
			companies += '<option>' + magnet.data.companies[i] + '</option>';
		}
		$('#filters #company').append(companies);
	}
	else {
		$('#filters #company').hide();
	}
	
	$('#filters #showAll').click(function() {
		magnet.showAll();
	});
	
	$('#filters #name').keyup(function() {
		console.log('#name.keyup: ' + this.value);
		
		if (this.value.length > 0) {
			magnet.reBind(magnet.filter.byName(this.value));
		}
		else {
			magnet.showAll();
		}
	});
	
	$('#filters #name').focus(function() {
		console.log('#name.focus: ' + this.value);
		
		if (this.value.length > 0) {
			magnet.reBind(magnet.filter.byName(this.value));
		}
		else {
			magnet.showAll();
		}
	});

	$('#filters #skills').change(function() {
	if (this.value.length > 0) {
		magnet.reBind(magnet.filter.bySkill([this.value]));
				}
		else {
			magnet.showAll();
		}
	});
	
	$('#filters #department').change(function() {
		if (this.value.length > 0) {
			magnet.reBind(magnet.filter.byDepartment([this.value]));
		}
		else {
			magnet.showAll();
		}
	});
	
	$('#filters #company').change(function() {
		if (this.value.length > 0) {
			magnet.reBind(magnet.filter.byCompany([this.value]));
		}
		else {
			magnet.showAll();
		}
	});
	
	magnet.updateCount();
};
