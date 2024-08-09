async function init() {
	//set initial values if empty (install, update, etc)
	if(await getPref("refresh_active") === undefined) {
		await setPref("refresh_active", default_prefs["refresh_active"]);
	}
	if(await getPref("refresh_wait") === undefined) {
		await setPref("refresh_wait", default_prefs["refresh_wait"]);
	}
	
	//init automatic download
	exec_refresh();
}

init();


//manually trigger download of alias file
browser.composeAction.onClicked.addListener((tab) => {
		initDownload();
})
