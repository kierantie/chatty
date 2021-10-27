import $ from "https://cdn.skypack.dev/jquery@3.6.0";

// Set up the defaults for guests
var parsedData = "";
var decodedData = '{"memberID":"rQVvzX8Q","memberEmail":"kieran@chatty.so","editorID":"rectcd1lTygJvjmKn","editorName":"Chatty Crew","editorFName":"Chatty","editor_baseRate1000wo":129,"editor_extraRatePer500wo":50,"editor_pairEditingRatePerHour":100,"editor_nextDayTurnaroundExtra":50,"editor_consultingRatePerHour":-1,"editor_outlineRateFixed":-1}';

// Set up which DOM IDs correspond to which values
var uiStorage = {
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
};

var calculate = function() {
    // Zero everything
    var zero = 0;
    uiStorage.baseRate.text(zero.toFixed(2));
    uiStorage.addOnsRate.text(zero.toFixed(2));
    uiStorage.platformFee.text(zero.toFixed(2));
    uiStorage.subtotal.text(zero.toFixed(2));
    
    // Set the initial base rate
    var newBaseRate = parsedData.editor_baseRate1000wo;
    
    // Calculate the base rate from the word count
    var wordCountInt = Number.parseInt(uiStorage.wordCount.val());
    console.log(wordCountInt);
    var wordCountMultiplier = Math.floor((wordCountInt - 1000) / 500);
    console.log(wordCountMultiplier);
    var baseRateMultiplier = wordCountMultiplier * parsedData.editor_extraRatePer500wo;
    console.log(baseRateMultiplier);
    newBaseRate += baseRateMultiplier;
    
    // Calculate the express fee
    var addons = 0;
    if(uiStorage.expressFee.is(':checked')) {
        addons += parsedData.editor_nextDayTurnaroundExtra;
    }
    console.log(addons);
    //newBaseRate += addons;
    
    // Calculate the subtotal
    var subtotal = newBaseRate + addons;
    
    // Calculate platform fee
    var platformFee = Math.ceil(newBaseRate * 0.12);
    subtotal += platformFee;
    
    // Update the UI
    uiStorage.baseRate.text(newBaseRate.toFixed(2));
    uiStorage.addOnsRate.text(addons.toFixed(2));
    uiStorage.subtotal.text(subtotal.toFixed(2));
    uiStorage.platformFee.text(platformFee.toFixed(2));
};

$( document ).ready(function() {
	// Get the prefill data and decode it (comment out if testing)
	//const rawData = urlParams.get('data');
	//decodedData = atob(rawData);

	//console.log("decodedData = " + decodedData);

	// Now parse the decoded data into an object
	parsedData = JSON.parse(decodedData);
    
    calculate();
	//console.log(parsedData);
});

uiStorage.wordCount.change(function() {
    calculate();
});

uiStorage.contentType.change(function() {
    calculate();
});

uiStorage.expressFee.change(function() {
    calculate();
});

