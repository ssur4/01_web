testBtn.addEventListener("click",  function () {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
           //document.getElementById("demo").innerHTML = xhttp.responseText;
        }
    };
    xhttp.open("GET", "/list", true);
    xhttp.send();
});