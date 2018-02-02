// globale Variable in der die Blog-Artikel gespeichert werden
var blogEntries = [];
var jumboTron, jumboTronH2, mainArea;

document.addEventListener("DOMContentLoaded", function () {
    var navLinks = document.querySelectorAll("#header-navbar a");
    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener("click", function (e) {
            // Verhinder normales Link-Verhalten
            e.preventDefault();

            document.querySelector("li.active").className = "";
            this.parentElement.className = "active";

            // Hole Wert aus dem data-page Attribut und setze das als Hash
            // Dadurch wird ein "hashchange" Event ausgelöst
            location.hash = this.dataset["page"];
        })
    }

});

document.addEventListener("DOMContentLoaded", function () {
    jumboTron = document.getElementsByClassName("jumbotron")[0];
    jumboTronH2 = jumboTron.getElementsByTagName("h2")[0];
    mainArea = document.querySelector("main");

    // Zeige Inhalt an
    insertTemplate(location.hash.trim().substr(1));
});

// Zwei mögliche Events:
// 1. hashchange = wenn location.hash sich ändert 
// 2. popstate
window.addEventListener("hashchange", function () {
    insertTemplate(location.hash.trim().substr(1));
});

function insertTemplate(strPage) {
    var templateContent;

    // Wenn strPage leer, weil kein Hash, dann Willkommen setzen
    strPage = strPage || "Willkommen";

    clearContentArea();

    switch (strPage) {
    case "Willkommen":
        templateContent = document.getElementById("WillkommenTemplate").content;
        jumboTronH2.textContent = "Willkommen auf Max's Homepage";
        break;
    case "Blog":
        getBlogArticlesFromServerAndInsertJQuery();
        return;
    case "Kontakt":
        templateContent = document.getElementById("KontaktTemplate").content;
        jumboTronH2.textContent = "Kontaktiere Max";
        break;
    case "About":
        templateContent = document.getElementById("AboutTemplate").content;
        jumboTronH2.textContent = "Über Max Mustermann";
        break;
    default: //anderer Hash
        templateContent = document.getElementById("WillkommenTemplate").content;
        jumboTronH2.textContent = "Willkommen auf Max's Homepage";
        break;
    }

    mainArea.appendChild(document.importNode(templateContent, true));
}


// Entferne alle Elemente aus der Main-Area und den JumboTron-Button
function clearContentArea() {
    while (mainArea.hasChildNodes()) {
        mainArea.removeChild(mainArea.lastChild);
    }

    //Wenn im Jumbotron ein Button enthalten ist, dann lösche ihn
    var jumboTronButton = jumboTron.getElementsByTagName("button");
    if (jumboTronButton.length > 0) {
        jumboTron.removeChild(jumboTronButton[0]);
    }
}

//load asynchronously, parse, cache and insert into Content Area
function getBlogArticlesFromServerAndInsert() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "Daten.json", true);
    // Alternative: 
    // xhr.onreadystatechange = function() {if (xhr.readyState === XMLHttpRequest.DONE)}
    // Mittlerweile funktioniert auch: xhr.addEventListener("readystatechange", function(){
    // Oder andere Events: load, error, abort, (progress, loadend, loadstart)
    // load: nachdem Response angekommen ist (entspricht readyState=4, XMLHttpRequest.DONE)
    xhr.addEventListener("load", function () {
        if (xhr.status === 200) {
            // Alternative ohne parse: xhr.response (seit HTML5)
            blogEntries = JSON.parse(xhr.responseText);
            insertBlogContent();
        }
        else {
            // Fehler-Status
            console.error("Fehler in Kommunikation" + xhr.status);
            console.error(xhr);
        }
    })
    xhr.send();
}

function getBlogArticlesFromServerAndInsertJQuery() {
    // das JQuery-Interface hat viele Default-Werte
    $.ajax("Daten.json", {
            // async: true,
            cache: false, // nicht notwendig, fügt timestamp an URL an
            // complete: function(){}, //wie always()
            // error: function(){}, //wie fail()
            // success: function(){}, //wie done()
            // dataType: "json", //default: intelligente Erkennung
            // headers: {},
            method: "GET",
            // statusCode: {
            //     200: function () {}, //wie done()
            //     404: function () {} //wie fail()
            // },
            timeout: 5000 //in ms
        }).done(function (data, textStatus, jqXHR) {
            // JQuery parst Daten automatisch von JSON zu JS-Object
            blogEntries = data;
            insertBlogContent();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.error("Fehler in Kommunikation: " + errorThrown + " " + textStatus);
            console.error(jqXHR);
        })
        //.always(function(){}) möglich, aber nicht notwendig
    ;

    //Alternative: $.get(url[, daten][, success cb][, return data type])
    // $.get("Daten.json").done(function (data, textStatus, jqXHR) {
    //     // JQuery parst Daten automatisch von JSON zu JS-Object
    //     blogEntries = data;
    //     insertBlogContent();
    // }).fail(function (jqXHR, textStatus, errorThrown) {
    //     console.error("Fehler in Kommunikation" + errorThrown);
    //     console.error(jqXHR);
    // });

    //Alternative: $.getJSON(url[, daten][, success cb])
}

function insertBlogContent() {
    jumboTronH2.textContent = "Max's Kurznachrichten-Blog";

    var blogModalTemplate = document.getElementById("BlogModalTemplate").content;

    var addNewArticleButton = blogModalTemplate.querySelector("button");
    jumboTron.appendChild(document.importNode(addNewArticleButton, true));

    //Füge bei der ersten Verwendung die (unsichtbare) EingabeMaske (Modal) dem Body hinzu
    var newArticleMaske = blogModalTemplate.querySelector("#newArticleModal");
    document.body.appendChild(document.importNode(newArticleMaske, true));

    var templateContent = createAllBlogEntries(blogEntries);
    mainArea.appendChild(document.importNode(templateContent, true));
}
