function openClass(evt, wynnclassName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].className = tabcontent[i].className.replace(" active", "");
    }

    setTimeout(() => {
        for (i = 0; i < tabcontent.length; i++) {
            if (tabcontent[i] != document.getElementById(wynnclassName)) {
                tabcontent[i].style.display = "none";
            }
        }
    }, 500)

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(wynnclassName).style.display = "block";
    evt.currentTarget.className += " active";
    setTimeout(() => {document.getElementById(wynnclassName).className += " active";}, 500)
}