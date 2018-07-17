// presets
function sendXMLRequest(onSuccess, requestType, url, data) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
        	if (xhttp.status == 200) {
        		onSuccess(this.responseText);
                // console.log(this.responseText);
        	}
        	else if (xhttp.status == 400) {
        		console.log('There was an error 400');
        	}
        	else {
        		console.log('something else other than 200 was returned');
        	}
        }
    };

    xhttp.open(requestType, url, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(data);
};


// function syntaxHighlight(json) {
//     json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
//     return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
//         var cls = 'number';
//         if (/^"/.test(match)) {
//             if (/:$/.test(match)) {
//                 cls = 'key';
//             } else {
//                 cls = 'string';
//             }
//         } else if (/true|false/.test(match)) {
//             cls = 'boolean';
//         } else if (/null/.test(match)) {
//             cls = 'null';
//         }
//         return '<span class="' + cls + '">' + match + '</span>';
//     });
// }


// const presets = new (function Presets() {
//     var json, presetDataURL = "https://api.myjson.com/bins/bbdra";
	
// 	this.load = function() {
//         loadXMLDoc(function(response) {
//             json = JSON.parse(response);
//         }, "GET", presetDataURL);
//     };

//     this.push = function(data) {

//     };

//     this.list = function() {
//         return json;
//     };

//     // this.load();

// })();