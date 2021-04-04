var browser = browser || chrome; // eslint-disable-line

// Button size and text is a bit small on firefox. Adding id to body to apply firefox specific CSS.
if (typeof InstallTrigger !== 'undefined')
	document.body.id = 'firefox';

browser.storage.local.get({
	expires: null,
	type: null,
	history: [],
	notification: true
}, items => {
	document.querySelector(`#expires button[value="${items.expires}"]`).classList.add('active');
	document.querySelector(`#type button[value="${items.type}"]`).classList.add('active');
	document.querySelector(`#notification button[value="${items.notification}"]`).classList.add('active');

	for (const entry of items.history) {
		const element = document.createElement('a');
		element.href = entry;
		element.textContent = entry;
		document.getElementById('history-list').append(element);
	}
});

document.querySelectorAll('#expires button').forEach(el => {
	el.addEventListener('click', function click() {
		document.querySelector('#expires button.active').classList.remove('active');
		this.classList.add('active');
		browser.storage.local.set({ expires: this.value === 'null' ? null : this.value });
	});
});

document.querySelectorAll('#type button').forEach(el => {
	el.addEventListener('click', function click() {
		document.querySelector('#type button.active').classList.remove('active');
		this.classList.add('active');
		browser.storage.local.set({ type: this.value === 'null' ? null : this.value });
	});
});

document.querySelectorAll('#notification button').forEach(el => {
	el.addEventListener('click', function click() {
		document.querySelector('#notification button.active').classList.remove('active');
		this.classList.add('active');
		browser.storage.local.set({ notification: this.value === 'true' ? true : false });
	});
});
