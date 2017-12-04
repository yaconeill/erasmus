/**
 *
 */
var mediumDegree = [];
/**
 *
 */
var advanceDegree = [];
/**
 *
 */
var professor = [];
var type = ['Todos'];
/**
 *
 * @param {*} type
 * @param {*} course
 * @param {*} country
 * @param {*} location
 */
function TypeMobility(type, course, country, location) {
	this.type = type;
	this.course = course;
	this.country = country;
	this.location = location;
}

var typeMobility = document.getElementById('typeMobility');
typeMobility.addEventListener('change', toggleDegree, false);

var toggle = document.getElementById('toggle');
toggle.addEventListener('change', toggleSelected, false);

/**
 *
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
			professor.push(pfr);
			break;
		}
	}
	type.push(mediumDegree[0].type, advanceDegree[0].type, professor[0].type);
	writeDropDown(type, 'typeMobility');
	toggleSelected();
	toggleDegree();
}

let countryGrp = document.getElementById('countryGrp');
let courseGrp = document.getElementById('courseGrp');
countryGrp.style.display = 'none';
courseGrp.style.display = 'none';

/**
 *
 */
function toggleSelected() {
	if (!toggle.checked) {
		countryGrp.style.display = 'none';
		courseGrp.style.display = '';
	} else {
		courseGrp.style.display = 'none';
		countryGrp.style.display = '';
	}
}

/**
 * 
 */
function showCountry(array) {
	var chckCountry = document.getElementById('checkCountry');
	let tmp=[];
	for (let i = 0; i < array.length; i++) {
		tmp.push(array[i].pais);		
	}
	// tmp = countryByCourse(mediumDegree);
	// tmp = countryByCourse(advanceDegree);
	// tmp = countryByCourse(professor);
	tmp = uniq(tmp);
	deleteTreeElements(chckCountry, false);
	for (let i = 0; i < tmp.length; i++) {
		var label = createElement('label', chckCountry, tmp[i], 'class', 'btn btn-danger', 'for', 'option' + i);
		createElement('input', label, null, 'type', 'checkbox', 'id', 'option' + i);
	}
	return tmp;
}

function countryByCourse(array) {
	let tmp = [];	
	for (let i = 0; i < array.length; i++) {
		tmp.push(array[i].country);
	}
	return tmp;
}

/**
 *
 */
function toggleDegree() {
	var selected = document.getElementById('typeMobility');
	switch (selected.value) {
	case type[0]:
		groupBy(mediumDegree, 'course', false);
		groupBy(mediumDegree, 'country', false);
		groupBy(advanceDegree, 'course', false);
		groupBy(advanceDegree, 'country', false);
		groupBy(professor, 'course', false);
		groupBy(professor, 'country', false);
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
		groupBy(professor, 'course', true);
		groupBy(professor, 'country', true);
		break;
	}

}

var infoCourse = [];
/**
 *
 */
var selectCourse = document.getElementById('course');
selectCourse.addEventListener('change', function () {
	var infoCourse = [];
	for (var e in data) {
		if (selectCourse.value == data[e].ciclo) {
			infoCourse.push(data[e]);
		}
	}
	showCountry(infoCourse);
}, false);

let submit = document.getElementById('submit');	
submit.addEventListener('click', generateMarker, false);



function generateMarker() {	
	infoCourse = selectedCountry(infoCourse);
	myMap(true, infoCourse);
}

function selectedCountry(infoCourse) {
	let checkBox = document.querySelectorAll('input');
	var selectCourse = document.getElementById('course');
	let tmp = [];
	let checked = [];
	for (let i = 1; i < checkBox.length; i++) {
		if (checkBox[i].checked)
			checked.push(checkBox[i].previousSibling.data);
	}

	for (var e in data){
		for (let j = 0; j < checked.length; j++) {
			if(data[e].pais == checked[j] && data[e].ciclo == selectCourse.value)
				tmp.push(data[e]);
		}
	}
	// for (let i = 0; i < infoCourse.length; i++) {
	// 	for (let j = 0; j < checked.length; j++) {
	// 		if(infoCourse[i].pais == checked[j])
	// 			tmp.push(infoCourse[i]);
	// 	}
	// }
	return tmp;
}

/**
 *
 * @param {*} array
 * @param {*} idToSearch
 * @param {*} all
 */
function groupBy(array, idToSearch, all) {
	var tag = document.getElementById(idToSearch);
	let tmp = ['---- Seleccionar mobilidad de ' + array[0].type + ' ----'];
	for (let i = 0; i < array.length; i++) {
		if (idToSearch == 'course') 
			tmp.push(array[i].course);
		if (idToSearch == 'country') 
			tmp.push(array[i].country);
	}
	if (all) 
		deleteTreeElements(tag, false);
	writeDropDown(tmp = uniq(tmp), idToSearch);
}

/**
 *
 * @param {Array} a - List of elements to 'group by'
 */
function uniq(a) {
	return Array.from(new Set(a));
}

/**
 *
 * @param {*} array
 * @param {*} id
 */
function writeDropDown(array, id) {
	var tag = document.getElementById(id);
	for (let i = 0; i < array.length; i++) {
		createElement('option', tag, array[i]);
	}
}

/**
 *
 */
init();