$(document).ready(function () {
    var request = {};
    var pairs = location.search.substring(1).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        request[pair[0]] = pair[1];
    }
    if(request['code']) $('#input').val(request['code']);
    if(request['memory'])$('#memory').val(request['memory']);
});