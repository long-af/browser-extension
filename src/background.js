function createNotification(type, title, message, sticky, timeout) {
	const notificationContent = {
		type,
		iconUrl: 'logo.png',
		title,
		message: message || ''
	};

	if (typeof InstallTrigger === 'undefined') // Does not work with firefox.
		notificationContent.requireInteraction = sticky || false;

	const id = `notification_${Date.now()}`;
	chrome.notifications.create(id, notificationContent);

	if (typeof timeout === 'number')
		setTimeout(() => chrome.notifications.clear(id), timeout);

	return id;
}

function copyText(text) {
	const input = document.createElement('textarea');
	document.body.appendChild(input);
	input.value = text;
	input.focus();
	input.select();
	document.execCommand('Copy');
	input.remove();
}

chrome.notifications.onClicked.addListener(id => {
	chrome.notifications.clear(id);
});

/* On extension icon click */
chrome.browserAction.onClicked.addListener(async tab => {
	try {
		const response = await fetch('https://api.long.af/create', {
			method: 'POST',
			body: JSON.stringify({
				url: tab.url
			})
		});
		const json = await response.json();
		copyText(json.url);
		createNotification('basic', 'URL shortened and copied to clipboard!', json.url, false, 5000);
	} catch (err) {
		console.log(err.toString());
		createNotification('basic', 'An error has occured!', err.toString(), true);
	}
});
