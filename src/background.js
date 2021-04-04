var browser = browser || chrome; // eslint-disable-line

function createNotification(title, message = '', sticky = false, timeout) {
	const notificationContent = {
		type: 'basic',
		iconUrl: 'logo.png',
		title, message
	};

	if (typeof InstallTrigger === 'undefined') {
		notificationContent.requireInteraction = sticky;
	}

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

function shortenLink(url) {
	browser.storage.local.get({
		expires: null,
		type: null,
		history: [],
		notification: true
	}, async items => {
		try {
			browser.browserAction.setBadgeText({ text: 'Uploading' });
			const response = await fetch('https://api.long.af/create', {
				headers: { 'Content-Type': 'application/json' },
				method: 'POST',
				body: JSON.stringify({
					url: url,
					expires: items.expires,
					type: items.type
				})
			});

			const json = await response.json();
			copyText(json.url);
			if (items.notification) createNotification('URL shortened and copied to clipboard!', json.url, false, 5000);

			if (items.history.length === 5)
				items.history.pop();

			items.history.unshift(json.url);

			browser.storage.local.set({ history: items.history });
		} catch (err) {
			console.log(err.toString());
			createNotification('An error has occured!', err.toString(), true);
		} finally {
			browser.browserAction.setBadgeText({ text: '' });
		}
	});
}

/* On extension icon click */
browser.browserAction.onClicked.addListener(tab => shortenLink(tab.url));

browser.notifications.onClicked.addListener(browser.notifications.clear);

chrome.contextMenus.create({
	title: 'long.af',
	contexts: ['page', 'link'],
	onclick: a => shortenLink(a.linkUrl || a.pageUrl)
});
