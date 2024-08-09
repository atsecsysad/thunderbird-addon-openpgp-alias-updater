const json_filename = "openpgp_alias.json";
const timer = ms => new Promise(res => setTimeout(res, ms))
var default_prefs = {
  url: "",
  refresh_wait: 240,
  refresh_active: true
};

function isValidWebUrl(url) {
   let regEx = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm;
   return regEx.test(url);
}


async function exec_refresh() {
		while(true) {
			if (await getPref("refresh_active")) {
				//console.log("refreshing at: "+ new Date().getHours()+ ":" + new Date().getMinutes() + ":" + new Date().getSeconds());
				initDownload();
			} else {
				//console.log("refreshing skipped at: "+ new Date().getHours()+ ":" + new Date().getMinutes() + ":" + new Date().getSeconds());
			}
			await timer(1000*60*await getPref("refresh_wait"));
		}
}




async function initDownload() {
	let url = await getPref("url");
	if (!isValidWebUrl(url)) {
		console.log("OpenPGP-Alias Updater: URL not valid, doing nothing");
	} else {
			return new Promise((resolve, reject) => {
			browser.downloads.download({
					url: url,
					filename: json_filename,
					conflictAction: "overwrite",
					saveAs: false
			}).then(function(id){
					browser.downloads.onChanged.addListener(function onChDl(dlDelta) {
							if(dlDelta.id == id && (dlDelta.state && dlDelta.state.current == "complete")){
									// if(callback)callback(id);
									browser.downloads.search({id: id}).then((downloads) => {
											//console.log("moving file to TB profile: "+ downloads[0].filename);
											browser.moveFile.moveFile(downloads[0].filename, json_filename);
											resolve(downloads[0]);
									});
									browser.downloads.onChanged.removeListener(onChDl);
							}
					});
			});
	  })
	}
}

async function getPref(key) {
	let result = await browser.storage.local.get(key);
  let value = result[key];
  //console.log("key: "+key +", value: "+value);
  return value;
}

async function setPref(key, value) {
	  let obj = {};
	  obj[key] = value;
	  browser.storage.local.set(obj);
}

async function loadPrefs() {
	for (let key in default_prefs) {
    let elem = document.getElementById(key);
    let result = await browser.storage.local.get(key);
    let value = result[key];
    if (value === undefined) {
      value = default_prefs[key];
    }

    switch (elem.localName) {
      case "input":
        let type = elem.getAttribute("type");
        if (type == "checkbox") {
          elem.checked = value;
        } else if (type == "number" || type == "text") {
          elem.value = value;
        }
        break;
      default:
        break;
    }

    elem.addEventListener("change", (event) => {
      savePrefs(event);
    });
  }
}

async function savePrefs(event) {
  let elem = event.target;
  let id = elem.id;
  let obj = {};

  switch (elem.localName) {
    case "input":
      let type = elem.getAttribute("type");
      if (type == "checkbox") {
        obj[id] = elem.checked;
      } else if (type == "number") {
        obj[id] = isNaN(elem.value) ? 0 : elem.value;
      } else if (type == "text") {
      	obj[id] = elem.value;
      }
      break;
    default:
      break;
  }
  browser.storage.local.set(obj);
 	//initiate immediate new download when enabling automatic downloads, or changing url
  if((elem.id == "refresh_active" && elem.checked == true) || elem.id == "url") {
  	initDownload();
  }
}