// CONSTANTS
// *****************************************************************************
const table = $('#orgs');
// const tableCols = [
//     "Organizations",
//     // "Organization",
//     "State",
//     "Collaborations",
// ];
const tableCols = [
    "organization_name",
    "state",
    "collaboration_links"//collaboration_name", 
];

const tableColumnTitles = [
    "Organizations",
    "State",
    "Collaborations"
];

_data = {};

// INIT ***********************************************
getFirebaseOrganizationData();
createTableHeader();

// SEARCH TEXT BOX CHANGE
$(".filter").keypress(function(e) {
    if (e.which == 13) {
        refreshTableData($(this).val());
    }
});

function hydrateView() {
    loadSearchFilters();
    refreshTableData("");
}

function getSelectedTableFilters() {
    var filters = [];
    for (var index in tableCols) {
        var selectedValues = $('select#' + tableCols[index]).val();
        if(selectedValues && selectedValues.length > 0) {
            filters[index] = selectedValues;
        }
    }
    return filters;
}

function filterData(filters) {
    var filteredRecords = {};

    if(filters) {
        for (var key in _data) {
            var row = _data[key];
            // Check filters
            var addToDisplay = true;
            for (var i in filters) {

                if (filters[i] && filters[i].length > 0) {
                    var result = row[tableCols[i]].includes(filters[i]);
                    if( result === false) {
                        addToDisplay = false;
                        break;
                    }
                }
            }
            if (addToDisplay) {
                filteredRecords[key] = row;
            }
        }
    }
    return filteredRecords;
}
// LOAD TABLE
// *****************************************************************************
function refreshTableData(query) {
    // note: query param was never used! TODO?
    // Filter data on query, show first 10.

    $("tbody tr").remove();
    // createTableHeaders();
   
    var filters = getSelectedTableFilters();
    var recordsToDisplay = filterData(filters);
    
    createTableBody(recordsToDisplay);

    jQuery(document).ready(function($) {
        $("tr").click(function() {
            console.log($(this).attr('id'));
            window.location = "http://www.sciencepolicyatlas.com/organization?org=" + $(this).attr('id');
        });
    });
}

function getRecord(name) {
    //testname = "AAAneurysmOutreach";
    //var v = "https://atlas-new-format.firebaseio.com/organizations/-KUHg_zY53oGUOhnhwEt/organization_name/.json?";

 var ref = new Firebase('https://atlas-new-format.firebaseio.com/organizations');

        ref.orderByChild('organization_name').startAt(name).endAt(name).once('value', function(snapshot) {
          snapshot.forEach(function(childSnapshot) {

          var key = childSnapshot.key();
          var data = childSnapshot.val();

          console.log(data);
          var v = "http://www.sciencepolicyatlas.com/organization?org=" + key;;
          console.log(v); 
          if(data) {
                window.location = "http://www.sciencepolicyatlas.com/organization?org=" + key;
            }
      });
      });
      return;

    $.ajax({
        type: "GET",
        dataType: "jsonp",
        data: JSON.stringify(name),
        url: "https://atlas-new-format.firebaseio.com/organizations/.json?",
// https://atlas-organizations.firebaseio.com/.json",
        // ?orderBy=\"organizations\"",
        success: function(data) {
            if(data) {
                window.location = "http://www.sciencepolicyatlas.com/organization?org=" + data;
            }
           // hydrateView();

        }
    });
}

function createTableBody(list) {
    // Add the header first
    console.log(list);
    for (var pos in list) {
        table.find('tbody:last').append(createTableRow(pos, list[pos]));
    }
}

function createTableRow(id, org) {
    var string = "<tr id='" + id + "'>";
    for (var i in tableCols) {
        var column = tableCols[i];

        string += "<td class=" + column + ">";
        if (column == "collaboration_links") {//collaboration_name") {
            var collabs = org.collaboration_links ? org.collaboration_links.split(", ") : "";//col].split(", ");

            for (var i in collabs) {

                var collab = collabs[i];

                 var collab_key = collab ? collab.split(" | ") : ""; 
                 for(kv in collab_key) {

                   if (i > 0) {
                       string += ", ";
                   }
                   var k = collab_key[1];
                   var name = collab_key[0];
                  // console.log(k);
                  // console.log(name);
                    string += "<a href=\"http://www.sciencepolicyatlas.com/collaboration?collab=" + k + "\">" + name + "</a>";
                    break;
                }
                //if (i > 0) {
                 //   string += ", ";
                //}
                //var collab = collabs[i];
                //string += "<a href=\"http://www.sciencepolicyatlas.com/collaboration?collab=" + collab + "\">" + collab + "</a>";
            }
        }
        // if(col == "Organizations") {
        //     string += org.organization_name ? org.organization_name : 'empty';
        // } 
        // if(col == "State") {
        //     string += org.state ? org.state : 'empty';
        // }
        else {
            string += org[column];
        }
        string += "</td>\n";
    }
    return string;
}

function createTableHeader() {
    var string = "<tr>";
    for (var i = 0; i < tableColumnTitles.length; i++) {
        string += "<th>" + tableColumnTitles[i] + "</th>";
    }
    string += "</tr>";
    table.find('thead').append(string);
}

function getFirebaseOrganizationData() {
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        url: "https://atlas-new-format.firebaseio.com/organizations/.json",
// https://atlas-organizations.firebaseio.com/.json",
        // ?orderBy=\"organizations\"",
        success: function(data) {
            _data = data;
            hydrateView();
        }
    });
}

// LOAD TABLE
// *****************************************************************************
function loadSearchFilters() {
    for (var i in tableCols) {
        createFilterFor(tableCols[i]);
    }
    $(".chosen-select").chosen().change(function(evt, params) {
        refreshTableData($(".filter").val());
    });
}

function createFilterFor(key) {
    var options = [];
    for (var org in _data) {

        // multiple collaborations on one line comma delimited
        var values = _data[org][key] ? _data[org][key].split(", ") : "";
        
        if(values.length > 0) {
            for (var n in values) {
                var value = values[n];
                value = value.trim();

                // collaborations have a key, don't display it
                if(value.indexOf('|') > -1) {
                    value = value.substr(0, value.indexOf('|'));
                }
                // already in filter?
                  if($.inArray(value, options) === -1) {
                    options.push(value);
                }
            }
        }
    }
    options.sort();

    var string = '<select id="' + key + '" class="chosen-select" multiple="' + options.length + '">';
    for (var i = 0; i < options.length; i++) {
        string += '<option value="' + options[i] + '">' + options[i] + '</option>';
    }
    string += '</select>';
    $("#options").append(string);

    var l = key.indexOf('_') > -1 ? key.indexOf('_') : key.length;
    var placeHolder = key.substr(0, l);

    placeHolder = placeHolder.charAt(0).toUpperCase() + placeHolder.substr(1);

    $("#" + key).chosen({
        max_selected_options: 5,
        no_results_text: "Oops, nothing found!",
        width: "90%",
        allow_single_deselect: true,
        placeholder_text_multiple: placeHolder,
    });
}
