// CONSTANTS
const table = $('#orgs');
const tableCols = [
    "organizations",
    "city",
    "participation",
];
_data = {};

// SEARCH TEXT BOX CHANGE
$(".filter").keypress(function(e) {
    if (e.which == 13) {
        tableWithQuery($(this).val());
    }
});


// INIT *******************************************************************
getData();
addHeader();
$(".chosen-select").chosen({
    max_selected_options: 5,
    no_results_text: "Oops, nothing found!",
    width: "100%",
});
// INIT *******************************************************************

function tableWithQuery(query) {
    // Filter data on query, show first 10.
    $("tbody tr").remove()
    var toShow = [];
    for (var key in _data) {
        if (matchQuery(_data[key], query)) {
            toShow.push(_data[key]);
        }
    }
    loadList(toShow);
}

function matchQuery(org, query) {
    return org["organizations"].toLowerCase().indexOf(query.toLowerCase()) > -1;
}

function loadList(l) {
    // Add the header first
    for (var i = 0; i < l.length; i++) {
        table.find('tbody:last').append(orgToRow(l[i]));
    }
}

function orgToRow(org) {
    var string = "<tr>";
    for (var i = 0; i < tableCols.length; i++) {
        col = tableCols[i];
        string += "<td class=" + col + ">";
        string += org[col];
        string += "</td>\n";
    }
    return string;
}

function addHeader() {
    var string = "<tr>";
    for (var i = 0; i < tableCols.length; i++) {
        string += "<th>" + tableCols[i] + "</th>";
    }
    string += "</tr>";
    table.find('tbody:last').append(string)
}

// Create a server request.
function getData() {
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        url: "https://atlas-9c89c.firebaseio.com/.json?orderBy=\"organizations\"&limitToFirst=20",
        success: function(data) {
            _data = data;
            tableWithQuery("");
            loadFilters();
        }
    });
}

// LOAD LOCATION LIST
function loadFilters() {
    for (var i = 0; i < tableCols.length; i++) {
        createFilterFor(tableCols[i]);
    }
}

function createFilterFor(key) {
    var options = [];
    for (org in _data) {
        options.push(_data[org][key]);
    }
    var string = '<select class="chosen-select" multiple="' + options.length + '">';
    for (var i = 0; i < options.length; i++) {
        string += '<option value="' + options[i] + '">' + options[i] + '</option>';
    }
    string += '</select>';
    $("#nameFilter").append(string);
}
