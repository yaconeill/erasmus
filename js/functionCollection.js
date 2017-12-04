/**
 * Validate if the number send is integer.
 * @param {String} text that will be displayed in prompt.
 */
function isInteger(text) {
	while (true) {
		var value = prompt(text);
		if (value != parseInt(value))
			alert('Sólo números enteros.');
		else
			return parseInt(value);
	}
}

/**
 * Validate if the number send is a positive float.
 * @param {String} text that will be displayed in prompt.
 */
function isPositiveFloat(text) {
	while (true) {
		var value = prompt(text);
		if (value != parseFloat(value))
			alert('Sólo valores positivos reales.');
		else
			return parseFloat(value);
	}
}

/**
 * Validate if the number send is a positive integer.
 * @param {String} text that will be displayed in prompt.
 */
function isPositiveInt(text) {
	while (true) {
		var value = prompt(text);
		if (value != parseInt(value) || parseInt(value) < 0)
			alert('Sólo valores positivos enteros.');
		else
			return parseInt(value);
	}
}

/**
 * Validate if the character send is a char.
 * @param {String} text that will be displayed in prompt.
 */
function isAChar(text) {
	while (true) {
		var value = prompt(text);
		if (value.length > 1)
			alert('Sólo caracteres individuales.');
		else if (value == '' || value.indexOf(' ') >= 0)
			alert('No dejar el campo en blanco.');
		else
			return value;
	}
}

/**
 * Global function to create elements with text(null if not) and 3 attributes max.
 */
function createElement(tag, node, text, attr1, attrValue1, attr2, attrValue2, attr3, attrValue3, attr4, attrValue4) {
	let element = document.createElement(tag);
	if (attr1 != undefined) {
		element.setAttribute(attr1, attrValue1);
		if (attr2 != undefined) {
			element.setAttribute(attr2, attrValue2);
			if (attr3 != undefined) {
				element.setAttribute(attr3, attrValue3);
				if (attr4 != undefined)
					element.setAttribute(attr4, attrValue4);
			}
		}
	}
	if (text != null) {
		let string = document.createTextNode(text);
		element.appendChild(string);
	}
	node.appendChild(element);
	return element;
}
/**
 * Function that randomly change the order of the elements inside an array.
 */
function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
}

/**
 * Recursive function to eliminate all sons, grandsons and itself if selfRemove is true.
 * @param {Object} node 
 * @param {Boolean} selfRemove 
 */
function deleteTreeElements(node, selfRemove) {
	while (node.hasChildNodes())
		clear(node.firstChild);
	if (selfRemove)
		node.remove();
}

/**
 * Complementary function to deleteTreeElements
 * @param {Object} node 
 */
function clear(node) {
	while (node.hasChildNodes())
		clear(node.firstChild);
	node.parentNode.removeChild(node);
}