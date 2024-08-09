//option.html interface JS
document.getElementById("refresh_active").addEventListener("change",function(event){
     if(event.target.checked)
        document.getElementById("refresh_wait").removeAttribute("disabled");
     else
        document.getElementById("refresh_wait").setAttribute("disabled","disabled");
});
//option.html interface JS

// see https://bugzilla.mozilla.org/show_bug.cgi?id=1641577
window.browser = window.browser.extension.getBackgroundPage().browser;

async function init() {
  await loadPrefs();
}

init();