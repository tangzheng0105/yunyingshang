function myRedirect(uri) {
    if (navigator.userAgent.match(/Android/i)) {
        document.location = uri;
    } else {
        window.location.replace(uri);
    }
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;
};
