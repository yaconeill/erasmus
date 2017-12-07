/**
 * Array that contains medium degree courses object
 */
var mediumDegree = [];

/**
 * Array that contains advance degree courses object
 */
var advanceDegree = [];

/**
 * Array that contains courses by teacher object
 */
var teacher = [];

/**
 * Contains the elements that will be sent to the map
 */
var elementsSendToMap = [];

/**
 * Contains the mobility dropdown list elements
 */
var type = ['Todos'];

/**
 * Object that collect the mobility attributes
 * @param {String} type
 * @param {String} course
 * @param {String} country
 * @param {Object} location
 */
function TypeMobility(type, course, country, location) {
	this.type = type;
	this.course = course;
	this.country = country;
	this.location = location;
}

/**
 * Object that collect the location attributes
 * @param {String} course 
 * @param {String} city 
 * @param {Float} latitud 
 * @param {Float} longitud 
 */
function Location(course, city, latitud, longitud) {
	this.course = course;
	this.city = city;
	this.latitud = latitud;
	this.longitud = longitud;
}

/**
 * Split the data file into 3 separated objects based on mobility type
 */
function init() {
	for (var e in data) {
		let obj = data[e];
		switch (obj.tipo) {
		case 'Grado Medio':
			var md = new TypeMobility(obj.tipo, obj.ciclo, obj.pais, obj.localizacion);
			mediumDegree.push(md);
			break;
		case 'Grado Superior':
			var ad = new TypeMobility(obj.tipo, obj.ciclo, obj.pais, obj.localizacion);
			advanceDegree.push(ad);
			break;
		case 'Profesorado':
			var pfr = new TypeMobility(obj.tipo, obj.ciclo, obj.pais, obj.localizacion);
			teacher.push(pfr);
			break;
		}
	}

	// Extract mobility names in order to create the mobility dropdown
	type.push(mediumDegree[0].type, advanceDegree[0].type, teacher[0].type);

	// These functions write the dropdown list, create the buttons and load the data.
	writeDropDown(type, 'typeMobility');
	toggleSelected();
	loadDataComboBox();
}

/**
 * Extract objects from data file and mobility objects, create the elements needed to show and load the data
 */
function loadDataComboBox() {
	var selected = document.getElementById('typeMobility');
	filter.checked = false;
	let tmp = [];
	switch (selected.value) {
	// type[0]: Todos, type[1]: Grado medio, type[2]: Grado superior, type[3]: Profesorado
	case type[0]:
		for (let e in data) {
			let obj = new TypeMobility(data[e].tipo, data[e].ciclo, data[e].pais, data[e].localizacion);
			tmp.push(obj);
		}
		groupBy(tmp, 'course', false);
		groupBy(tmp, 'country', false);
		break;
	case type[1]:
		groupBy(mediumDegree, 'course', true);
		groupBy(mediumDegree, 'country', true);
		break;
	case type[2]:
		groupBy(advanceDegree, 'course', true);
		groupBy(advanceDegree, 'country', true);
		break;
	case type[3]:
		groupBy(teacher, 'course', true);
		groupBy(teacher, 'country', true);
		break;
	}
}

// #region - DOM reference
let typeMobility = document.getElementById('typeMobility');
let toggle = document.getElementById('toggle');
let selectAllCourse = document.getElementById('selectAllCourse');
let selectAllCountry = document.getElementById('selectAllCountry');
let filter = document.getElementById('filter');
let country = document.getElementById('country');
let btnSubmit = document.getElementById('submit');
let countryGrp = document.getElementById('countryGrp');
let courseGrp = document.getElementById('courseGrp');

// #endregion

// Hide by defect the course and country divs that contains the dropdown and checkbox
countryGrp.style.display = 'none';
courseGrp.style.display = 'none';

// #region - Event creation
typeMobility.addEventListener('change', loadDataComboBox, false);
// Switch between course and country filter
toggle.addEventListener('change', toggleSelected, false);
selectAllCourse.addEventListener('click', function () {
	selectAllCountryCheckBox(selectAllCourse, '.checkCourse', 'course');
}, false);
btnSubmit.addEventListener('click', generateMarker, false);
// Activate the country filter by course
filter.addEventListener('change', function () {
	let selectCourse = document.querySelectorAll('input.checkCourse');
	if (filter.checked) {
		for (let i = 0; i < selectCourse.length; i++)
			selectCourse[i].addEventListener('change', checkCoursesForCountry, false);
		selectAllCountry.style.display = 'initial';
	} else {
		for (let i = 0; i < selectCourse.length; i++)
			selectCourse[i].removeEventListener('change', checkCoursesForCountry, false);
		selectAllCountry.style.display = 'none';
	}
	checkCoursesForCountry();
}, false);
// #endregion

/**
* Allows switch the search by course or country
*/
function toggleSelected() {
	// reset the map
	myMap();
	if (!toggle.checked) {
		countryGrp.style.display = 'none';
		courseGrp.style.display = '';
	} else {
		courseGrp.style.display = 'none';
		countryGrp.style.display = '';
	}
	btnSubmit.style.display = 'inline-block';
	filter.checked = false;
	selectAllCountry.style.display = 'none';
}

/**
 * Generate an element list with the countries from the selected courses
 * @param {Object} array - Selected courses
 */
function showCountryByCourse(array) {
	var checkCountry = document.getElementById('selectAllCountry');
	let tmp = [];
	// Extract the country name from the given array
	for (let i = 0; i < array.length; i++) {
		tmp.push(array[i].pais);
	}
	// Call the merge function
	tmp = merge(tmp);
	// Clean the elements to prevent nesting
	deleteTreeElements(checkCountry, false);

	if (tmp.length > 0) {
		let btnSelectAll = createElement('label', checkCountry, 'Marcar todos', 'class', 'btn btn-primary', 'for', 'selectAll');
		var input = createElement('input', btnSelectAll, null, 'type', 'checkbox', 'id', 'selectAll');
		for (let i = 0; i < tmp.length; i++) {
			let label = createElement('label', checkCountry, tmp[i], 'class', 'btn btn-default', 'for', 'country' + i);
			createElement('input', label, null, 'type', 'checkbox', 'id', 'country' + i, 'class', 'check');
		}
		// Create the country checkbox event
		btnSelectAll.addEventListener('click', function () {
			selectAllCountryCheckBox(input, 'input.check', 'country');
		}, false);
	}
}

/**
* Extract from data file the course and the location coordinates
*/
function showCountry() {
	let tmp = [];
	for (let e in data) {
		if (data[e].pais == country.value) {
			let obj = new Location(data[e].ciclo, data[e].localizacion.ciudad,
				data[e].localizacion.latitud, data[e].localizacion.longitud);
			tmp.push(obj);
		}
	}
	return tmp;
}

/**
* Compares the selected courses with data file objects and store them in the array elementsSendToMap
*/
function checkCoursesForCountry() {
	elementsSendToMap = [];
	let selectedCourses = document.querySelectorAll('input.checkCourse');
	for (let e in data)
		for (let i = 0; i < selectedCourses.length; i++)
			if (selectedCourses[i].previousSibling.data == data[e].ciclo)
				if (selectedCourses[i].checked)
					elementsSendToMap.push(data[e]);
	// If toggle 'ciclo/pais' is checked ('pais' activated) show the countries from selected courses
	if (!toggle.checked)
		showCountryByCourse(elementsSendToMap);
}

/**
 * Extract from data file the locations and create objects with them to create the markers
 * @param {String} array - Selected courses or countries array
 * @param {String} use - Course or country depending on the toggle
 */
function selectedCountry(array, use) {
	let tmp = [];
	var courseCheck = document.querySelectorAll('input.checkCourse');	
	for (let e in data)
		for (let j = 0; j < array.length; j++) {
			if (use == 'course') {
				if (data[e].ciclo == array[j]) {
					let obj = new Location(data[e].ciclo, data[e].localizacion.ciudad,
						data[e].localizacion.latitud, data[e].localizacion.longitud);
					tmp.push(obj);
				}
			} else {
				for (let i = 0; i < courseCheck.length; i++) {
					if (data[e].pais == array[j] && data[e].ciclo == courseCheck[i].previousSibling.data) {
						let obj = new Location(data[e].ciclo, data[e].localizacion.ciudad,
							data[e].localizacion.latitud, data[e].localizacion.longitud);
						tmp.push(obj);
					}
				}
			}
		}
	return tmp;
}

/**
 * Select/deselect all the checkbox
 * @param {Object} select - Checkbox select all
 * @param {String} query - filter to access all checkbox
 * @param {String} use - Course or country depending on the toggle
 */
function selectAllCountryCheckBox(select, query, use) {
	let node = document.querySelectorAll(query);
	if (use == 'course')
		if (!select.checked)
			node.forEach(function (e) {
				e.checked = false;
			});
		else
			node.forEach(function (e) {
				e.checked = true;
			});
	else {
		if (select.checked)
			node.forEach(function (e) {
				e.checked = false;
				e.parentNode.className = 'btn btn-default';
			});
		else
			node.forEach(function (e) {
				e.checked = true;
				e.parentNode.className += ' active';
			});
	}
}

/**
 * Generate the marker depending on toggles
 */
function generateMarker() {
	let tmp = [];
	var courseCheck = document.querySelectorAll('input.checkCourse');	
	if (!toggle.checked) {
		if (!filter.checked) {
			tmp = newFunction(courseCheck);
			if (tmp.length > 0) {
				elementsSendToMap = coursesByCity(selectedCountry(tmp, 'course'));
				myMap(elementsSendToMap, 1);
			} else
				alert('Debe seleccionar al menos un ciclo');
		} else {
			let allCountryCheck = document.querySelectorAll('input.check');
			tmp = newFunction(allCountryCheck);
			if (tmp.length > 0) {
				elementsSendToMap = coursesByCity(selectedCountry(tmp, 'country'));
				myMap(elementsSendToMap, 1);
			} else
				alert('Debe seleccionar al menos un país');
		}
	} else {
		if (country.value != 0) {
			elementsSendToMap = coursesByCity(showCountry());
			myMap(elementsSendToMap, 1);
		} else
			alert('Debe seleccionar un país');
	}
}

/**
 * Create an array with the courses selected
 * @param {Object} node 
 */
function newFunction(node) {
	let checked = 0;
	let tmp = [];
	node.forEach(function (e) {
		if (e.checked) {
			checked++;
			tmp.push(e.previousSibling.data);
		}
	});
	return tmp;
}

/**
* Group the courses by city
* @param {Object} array 
*/
function coursesByCity(array) {
	let cities = [];
	for (let i = 0; i < array.length; i++)
		cities.push(array[i].city);
	cities = merge(cities);

	let tmp = [];
	for (let i = 0; i < cities.length; i++) {
		let city = cities[i];
		let course = [];
		let location = [];
		for (let j = 0; j < array.length; j++)
			if (city == array[j].city) {
				course.push(array[j].course);
				location.push(array[j].latitud, array[j].longitud);
			}
		course = merge(course);
		tmp.push([city, course, location]);
	}
	return tmp;
}

/**
* Group the elements by course or country
* @param {Object} array - 
* @param {String} idToSearch
* @param {Boolean} all - 
*/
function groupBy(array, idToSearch, all) {
	let tag = document.getElementById(idToSearch);
	let tmp = [];
	for (let i = 0; i < array.length; i++) {
		if (idToSearch == 'course')
			tmp.push(array[i].course);
		if (idToSearch == 'country')
			tmp.push(array[i].country);
	}
	// Clean the course container to prevent nesting
	if (all)
		deleteTreeElements(tag, false);
	writeDropDown(tmp = merge(tmp), idToSearch);
}

/**
* Eliminates the duplicated elements
* @param {Array} a - List of elements to 'group by'
*/
function merge(a) {
	return Array.from(new Set(a));
}

/**
* Write the elements on the container with the id given
* @param {String} array
* @param {String} id
*/
function writeDropDown(array, id) {
	let tag = document.getElementById(id);
	for (let i = 0; i < array.length; i++) {
		if (id == 'course') {
			let p = createElement('p', tag, null);

			let label = createElement('label', p, array[i], 'for', 'option' + i);
			createElement('input', label, null, 'type', 'checkbox', 'id', 'option' + i, 'class', 'checkCourse');
			// createElement('span', label, array[i]);
		}
		else
			createElement('option', tag, array[i]);
	}
}

/**
* Call the initial function
*/
init();