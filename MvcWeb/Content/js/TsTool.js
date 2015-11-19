var TsTool = function() {
    
}

TsTool.HttpContext = function() {
    
}

TsTool.HttpContext.Request = function(key) {
    var queryString = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof queryString[pair[0]] === "undefined") {
            queryString[pair[0]] = pair[1];
            // If second entry with this name
        } else if (typeof queryString[pair[0]] === "string") {
            var arr = [queryString[pair[0]], pair[1]];
            queryString[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            queryString[pair[0]].push(pair[1]);
        }
    }
    return queryString[key];
}



TsTool.DevTool = function() {
    
}

TsTool.DevTool.CheckIsDevToolOpen = function() {
    return (window.outerHeight - window.innerHeight) > 100;
}

TsTool.Cache = function () {

}