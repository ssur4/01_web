//클라이언트코드

testBtn.addEventListener('click', async function(){
    /*
        var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
           //document.getElementById("demo").innerHTML = xhttp.responseText;
           console.log(xhttp.responseText);         //브라우저측 콘솔에 출력
        }
    };
    xhttp.open("GET", "/list", true);
    xhttp.send();
    });
    */
    
    
    
        let resObj = await fetch('/list');           //list에 호출한 값을 받을때까지 ㅣ다린다 await
        let data = await resObj.json();                   //pending => json 도 비동기함수라는 것을 알 수 있다. => await 필요
        //console.log(data);
    
        let displayData = 
        `<thead>
            <td>ID</td>
            <td>Title</td>
            <td>writer</td>
            <td>created</td>
        </thead>
        <tbody>`; 
        data.forEach((item, index) => {             //동기함수
            displayData +=
            `<tr>
                <td>${item.id}</td>
                <td>${item.title}</td>
                <td>${item.profile_id}</td>
                <td>${item.created}</td>
            </tr>`
        });
        displayData += `</tbody>`;
    
        document.getElementById("datatablesSimple").innerHTML = displayData;
    });
    