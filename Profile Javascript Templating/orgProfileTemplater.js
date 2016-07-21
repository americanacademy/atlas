<style>
    #header {
        display: none
    }

    #footer {
        display: none
    }

    #preFooter {
        display: none
    }
</style>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
<script type="text/javascript">

    // Create a server request.
    function getData(org, callback) {
        $.ajax({
            type: "GET",
            dataType: "jsonp",
            // url: "https://atlas-9c89c.firebaseio.com/.json?orderBy=\"organizations\"&limitToFirst=20",
            url: "https://atlas-organizations.firebaseio.com/"+org+"/.json?",
            success: function(data) {
                callback(data);
            }
        });
    }

    function replace(selectorString, temp, value) {
        console.log("replacing " + temp + " with " + value);
        $(selectorString).each(function() {
            var text = $(this).text();
            text = text.replace(temp, value);
            $(this).text(text);
        });
    }

    function loadData(data) {
        data["Address"] = data["Addressa"] + data["Addressb"] + data["City"] + data["ZIP"];
        for (var key in data) {
            replace("h1, h2, h3, span", "{"+ key + "}", data[key]);
        }
    }

    $(window).load(function() {
        var getUrlParameter = function getUrlParameter(sParam) {
            var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
        };

        var org = getUrlParameter('org');

        // Download the Firebase data for this specific orgKey
        getData(org, loadData);

    });
</script>
