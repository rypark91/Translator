let languageObjectList = {};//Stores languages, using language as the key and the name as a valu
$(function(){
    
    var currentlyDown = false;
    $(document).mousedown(function(){
        currentlyDown = true;

    }).mouseup(function(){
        currentlyDown = false;
    });

    //sets ups initial values
    $("input[type='checkbox']").prop("checked",false);
    $("#detect").val("");
    $("#translated").val("");
    $("button").prop('disabled',true);

    //disables or enables the detect and translate buttons depenind on the detect text box length
    $("#detect").keyup(function(){
        if($(this).val().length === 0){
            $("button").prop('disabled',true);
        }
        else{
            $("button").prop('disabled',false);
        }
    });
    //sets up initial background color for buttons
    let currentColor = "white";
    
    //switches between light mode or dark mode with the slider toggle
    $(".slider").click(function(){

        if($("input[type='checkbox']").is(":checked") === true ){
            currentColor = "white";//sets up current background color for button
            $("body").css("background-image", "linear-gradient( to bottom, lightblue, white)");
            $("label").css("color", "white");
            $("textarea").css({"background-color": "white","color": "black"});
            $("h1").css("color", "white");
            $("p").css("color", "white");
            $("button").css({"background-color": currentColor,"color": "lightblue"});
            $("select").css({"background-color": currentColor,"color": "lightblue"});
            $(".footer p").css("color", "lightblue");
        }
        else{
            currentColor = "blue";//sets up current background color for button
            $("body").css("background-image", "linear-gradient( to bottom, black, blue)");
            $("label").css("color", "blue");
            $("textarea").css({"background-color": "darkgray","color": "white"});
            $("h1").css("color", "blue");
            $("p").css("color", "blue");
            $("button").css({"background-color": currentColor,"color": "black"});
            $("select").css({"background-color": currentColor,"color": "black"});
            $(".footer p").css("color", "black");
            
        }
    });

    //gives the background of a button feed back when pressed
    $("button").mousedown(function(){
        $(this).css("background-color","darkblue");
        
    });

    //indicates that the cursor is over the button
    $("button").mouseenter(function(){
        if($(this).is(":enabled") === true ){
            if(currentlyDown){
                $(this).css("background-color","darkblue");
            }
            else{
                $(this).css("background-color","darkgrey");
            }
        }
    });

    //changes to the original color depending on light mode or dark mode
    $("button").mouseleave(function(){
        $(this).css("background-color", currentColor);
    });

    //translates whatever is in the detect text box
    $("#translateB").click(function(){

        $("button").prop('disabled',true);//to prevent multiple calls
        //detects the language
        const settings3 = {
            "async": true,
            "crossDomain": true,
            "url": "https://google-translate1.p.rapidapi.com/language/translate/v2/detect",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
                "accept-encoding": "application/gzip",
                "x-rapidapi-key": "08de0fa1b3mshc88eaff21fbf380p15fd7fjsn2fdca5c03488",
                "x-rapidapi-host": "google-translate1.p.rapidapi.com"
            },
            "data": {
                "q": $("#detect").val()
            }
        };

        //gets the language code to send
        let languageCode = "";
        $.ajax(settings3).done(function (response) {
            languageCode = response.data.detections[0][0].language;
        });
        
        //translates the actual text into the desired language
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://google-translate1.p.rapidapi.com/language/translate/v2",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
                "accept-encoding": "application/gzip",
                "x-rapidapi-key": "08de0fa1b3mshc88eaff21fbf380p15fd7fjsn2fdca5c03488",
                "x-rapidapi-host": "google-translate1.p.rapidapi.com"
            },
            "data": {
                "q": $("#detect").val(),
                "target": $("#languageList").val(),
                "source": languageCode
            }
        };
        
        $.ajax(settings).done(function(response) {

            $("#translated").val(response.data.translations[0].translatedText);
        });
        $("button").prop('disabled',false);//resets the buttons

    });
    //detects the language
    $("#detectB").click(function(){
        $("button").prop('disabled',true);//to prevent multiple calls
        const settings3 = {
            "async": true,
            "crossDomain": true,
            "url": "https://google-translate1.p.rapidapi.com/language/translate/v2/detect",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
                "accept-encoding": "application/gzip",
                "x-rapidapi-key": "08de0fa1b3mshc88eaff21fbf380p15fd7fjsn2fdca5c03488",
                "x-rapidapi-host": "google-translate1.p.rapidapi.com"
            },
            "data": {
                "q": $("#detect").val()
            }
        };
        
        $.ajax(settings3).done(function (response) {
            $("#detectedLanguage").text(languageObjectList[response.data.detections[0][0].language]);//shows the detected language
        });
        $("button").prop('disabled',false);//resets the buttons
    });
    
});

//gets the language list element for name placement
let languageList = document.querySelector("#languageList");


//gets the list of languages and places them in the select box
function init(){
    const settings2 = {
        "async": true,
        "crossDomain": true,
        "url": "https://google-translate1.p.rapidapi.com/language/translate/v2/languages?target=en",
        "method": "GET",
        "headers": {
            "accept-encoding": "application/gzip",
            "x-rapidapi-key": "08de0fa1b3mshc88eaff21fbf380p15fd7fjsn2fdca5c03488",
            "x-rapidapi-host": "google-translate1.p.rapidapi.com"
        }
    };
    
    $.ajax(settings2).done(function (response) {
        let list = response.data.languages;
        for(var i = 0; i < list.length; i++){
            languageList.insertAdjacentHTML("beforeend","<option value=" + list[i].language + 
            ">" + list[i].name + "</option>");
            languageObjectList[list[i].language] = list[i].name;
        }
    });
}
init();
