var browser = browser || chrome; // eslint-disable-line

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
	browser.notifications.create(id, notificationContent);

	if (typeof timeout === 'number')
		setTimeout(() => browser.notifications.clear(id), timeout);

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

browser.notifications.onClicked.addListener(id => {
	browser.notifications.clear(id);
});

/* On extension icon click */
browser.browserAction.onClicked.addListener(tab => {
	browser.storage.local.get({
		expires: null,
		type: null
	}, async items => {
		try {
			const response = await fetch('https://api.long.af/create', {
				method: 'POST',
				body: JSON.stringify({
					url: tab.url,
					expires: items.expires,
					type: items.type
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
});
