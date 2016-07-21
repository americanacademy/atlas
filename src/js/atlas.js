// CONSTANTS
// *****************************************************************************
const table = $('#orgs');
const tableCols = [
    "Organization",
    "State",
    "Collaborations",
];
_data = {};

// SEARCH TEXT BOX CHANGE
$(".filter").keypress(function(e) {
    if (e.which == 13) {
        tableWithQuery($(this).val());
    }
});

// INIT
// *****************************************************************************
getData();

function dataLoaded() {
    loadFilters();
    tableWithQuery("");
}

// LOAD TABLE
// *****************************************************************************
function tableWithQuery(query) {
    // Filter data on query, show first 10.
    $("tbody tr").remove();
    addHeader();
    var toShow = {};
    // Load up the filters.
    var filters = [];
    for (var index in tableCols) {
        var selectedValues = $('select#' + tableCols[index]).val();
        filters[index] = selectedValues;
    }
    // Now actually filter the rows.
    for (var key in _data) {
        var row = _data[key];
        // Check filters
        var passed = true;
        for (var i in filters) {
            if (filters[i] &&
                filters[i].length > 0 &&
                $.inArray(row[tableCols[i]], filters[i]) === -1) {
                passed = false;
                break;
            }
        }
        if (passed) {
            toShow[key] = row;
        }
    }
    loadList(toShow);
    jQuery(document).ready(function($) {
        $("tr").click(function() {
            window.location = "http://www.sciencepolicyatlas.com/organization?org=" + $(this).attr('id');
        });
    });
}

function loadList(l) {
    // Add the header first
    console.log(l);
    for (var k in l) {
        table.find('tbody:last').append(orgToRow(k, l[k]));
    }
}

function orgToRow(id, org) {
    var string = "<tr id='" + id + "'>";
    for (var i in tableCols) {
        col = tableCols[i];
        string += "<td class=" + col + ">";
        if (col == "Collaborations") {
            var collabs = org[col].split(", ");
            for (var i in collabs) {
                if (i > 0) {
                    string += ", ";
                }
                var collab = collabs[i];
                string += "<a href=\"http://www.sciencepolicyatlas.com/collaboration?collab=" + collab + "\">" + collab + "</a>";
            }
        } else {
            string += org[col];
        }
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
    table.find('tbody:first').append(string);
}

// Create a server request.
function getData() {
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        url: "https://atlas-organizations.firebaseio.com/.json?orderBy=\"organizations\"",
        success: function(data) {
            _data = data;
            dataLoaded();
        }
    });
}

// LOAD TABLE
// *****************************************************************************
function loadFilters() {
    for (var i in tableCols) {
        createFilterFor(tableCols[i]);
    }
    $(".chosen-select").chosen().change(function(evt, params) {
        tableWithQuery($(".filter").val());
    });
}

function createFilterFor(key) {
    var options = [];
    for (var org in _data) {
        if ($.inArray(_data[org][key], options) === -1) {
            options.push(_data[org][key]);
        }
    }
    var string = '<select id="' + key + '" class="chosen-select" multiple="' + options.length + '">';
    for (var i = 0; i < options.length; i++) {
        string += '<option value="' + options[i] + '">' + options[i] + '</option>';
    }
    string += '</select>';
    $("#options").append(string);

    $("#" + key).chosen({
        max_selected_options: 5,
        no_results_text: "Oops, nothing found!",
        width: "90%",
        allow_single_deselect: true,
        placeholder_text_multiple: key,
    });
}
