// Shamelessly pilfered from https://discourse.webflow.com/t/add-onclick-attribute-to-any-element-with-this-js-snippet/23730
window.onload = function() {
    var anchors = document.getElementsByTagName('*');
    for(var i = 0; i < anchors.length; i++) {
        var anchor = anchors[i];
        anchor.onclick = function() {
            var code = this.getAttribute('whenClicked');
            eval(code);   
        }
    }
}
    
// Shamelessly pilfered from https://www.sitepoint.com/get-url-parameters-with-javascript/
function getAllUrlParams(url) {
    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // set parameter name and value (use 'true' if empty)
            var paramName = a[0];
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

            // if the paramName ends with square brackets, e.g. colors[] or colors[2]
            if (paramName.match(/\[(\d+)?\]$/)) {

                // create key if it doesn't exist
                var key = paramName.replace(/\[(\d+)?\]/, '');
                if (!obj[key]) obj[key] = [];

                // if it's an indexed array e.g. colors[2]
                if (paramName.match(/\[\d+\]$/)) {
                  // get the index value and add the entry at the appropriate position
                  var index = /\[(\d+)\]/.exec(paramName)[1];
                  obj[key][index] = paramValue;
                } else {
                  // otherwise add the value to the end of the array
                  obj[key].push(paramValue);
                }
            } else {
                // we're dealing with a string
                if (!obj[paramName]) {
                  // if it doesn't exist, create property
                  obj[paramName] = paramValue;
                } else if (obj[paramName] && typeof obj[paramName] === 'string'){
                  // if property does exist and it's a string, convert it to an array
                  obj[paramName] = [obj[paramName]];
                  obj[paramName].push(paramValue);
                } else {
                  // otherwise add the property
                  obj[paramName].push(paramValue);
                }
            }
        }
    }

    return obj;
}




// CHATTYCALC 0.1
// Set up the defaults for guests
var ChattyCheckout = {
    parsedData: "",
    decodedData: '{"memberID":"rQVvzX8Q","memberEmail":"kieran@chatty.so","editorID":"rectcd1lTygJvjmKn","editorName":"Chatty Crew","editorFName":"Chatty","editor_baseRate1000wo":129,"editor_extraRatePer500wo":50,"editor_pairEditingRatePerHour":100,"editor_nextDayTurnaroundExtra":50,"editor_consultingRatePerHour":-1,"editor_outlineRateFixed":-1}',
    uiStorage: {
        memberID: $("#memberID"),
        editorID: $("#editorID"),
        editorFName: $(".editorFName"),
        editorName: $(".editorName"),
        contentType: $("[name='ContentType']"),
        baseRate: $("#baseRate"),
        addOnsRate: $("#addOnsRate"),
        platformFee: $("#platformFee"),
        subtotal: $("#subtotal"),
        wordCount: $("#wordCount"),
        expressFee: $("#expressFee"),
        addOnsRate: $("#addOnsRate"),
    },
};

var calculate = function() {
    // Zero everything
    var zero = 0;
    ChattyCheckout.uiStorage.baseRate.text(zero.toFixed(2));
    ChattyCheckout.uiStorage.addOnsRate.text(zero.toFixed(2));
    ChattyCheckout.uiStorage.platformFee.text(zero.toFixed(2));
    ChattyCheckout.uiStorage.subtotal.text(zero.toFixed(2));
    
    // Set the initial base rate
    var newBaseRate = ChattyCheckout.parsedData.editor_baseRate1000wo;
    
    // Calculate the base rate from the word count
    var wordCountInt = Number.parseInt(ChattyCheckout.uiStorage.wordCount.val());
    //console.log(wordCountInt);
    var wordCountMultiplier = Math.floor((wordCountInt - 1000) / 500);
    //console.log(wordCountMultiplier);
    var baseRateMultiplier = wordCountMultiplier * ChattyCheckout.parsedData.editor_extraRatePer500wo;
    //console.log(baseRateMultiplier);
    newBaseRate += baseRateMultiplier;
    
    // Calculate the express fee
    var addons = 0;
    if(ChattyCheckout.uiStorage.expressFee.is(':checked')) {
        addons += ChattyCheckout.parsedData.editor_nextDayTurnaroundExtra;
    }
    //console.log(addons);
    //newBaseRate += addons;
    
    // Calculate the subtotal
    var subtotal = newBaseRate + addons;
    
    // Calculate platform fee
    var platformFee = Math.ceil(newBaseRate * 0.12);
    subtotal += platformFee;
    
    // Update the UI
    ChattyCheckout.uiStorage.baseRate.text(newBaseRate.toFixed(2));
    ChattyCheckout.uiStorage.addOnsRate.text(addons.toFixed(2));
    ChattyCheckout.uiStorage.subtotal.text(subtotal.toFixed(2));
    ChattyCheckout.uiStorage.platformFee.text(platformFee.toFixed(2));
};

ChattyCheckout.uiStorage.wordCount.change(function() {
    calculate();
});

ChattyCheckout.uiStorage.contentType.change(function() {
    calculate();
});

ChattyCheckout.uiStorage.expressFee.change(function() {
    calculate();
});


$( document ).ready(function() {
    // Get the prefill data and decode it (comment out if testing)
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if(urlParams.has('data')) {
        const rawData = urlParams.get('data');
        ChattyCheckout.decodedData = atob(rawData);
    }

    //console.log("decodedData = " + ChattyCheckout.decodedData);

    // Now parse the decoded data into an object
    ChattyCheckout.parsedData = JSON.parse(ChattyCheckout.decodedData);
    
    calculate();

    //console.log(ChattyCheckout.parsedData);
});

