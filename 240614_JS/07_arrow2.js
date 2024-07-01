/* #1
let obj = {
    myVar : "foo",
    myFunc : function() {
        console.log(this.myVar);
    },
};

obj.myFunc();
*/

/* #3
let obj = {
    myVar : "foo",
    myFunc : function() {
        console.log(this.myVar);   //수행 컨텍스트가 obj
        setTimeout(function(){
            console.log(this.myVar);  //수행 컨텍스트가 window
        }, 1000);
    },
};

obj.myFunc();
*/

/* #4
let obj = {
    myVar : "foo",
    myFunc : function() {
        let self = this;
        console.log(this.myVar);   //수행 컨텍스트가 obj

        
        setTimeout(function(){
            console.log(self.myVar);  //수행 컨텍스트가 obj
        }, 1000);
    },
};

obj.myFunc();
*/

/*5
let obj = {
    myVar : "foo",
    myFunc : function() {
        
        console.log(this.myVar);   //수행 컨텍스트가 obj

        
        setTimeout(function(){
            console.log(this.myVar);  //수행 컨텍스트가 obj
        }.bind(this), 1000);          //모든 객체는 bind 라는 내장 메소드 존재
    },                                //this : 코드 짤 시점의 this 라고 생각..?
};

obj.myFunc();
*/


// #5 추천 작성법
let obj = {
    myVar : "foo",
    myFunc : function() {
        
        console.log(this.myVar);   //수행 컨텍스트가 obj

        setTimeout(() =>  {            //화살표 함수, function() 객체가 만들어질 때 this 를 바인딩
            console.log(this.myVar);  //수행 컨텍스트가 obj
        }, 1000);
    },                      
};


obj.myFunc();



/*
let obj = {
    myVar : "foo",
    myFunc : () => { //화살표 함수, 미리 만들어져 바인딩 되지 않고 호출 시 바인딩 된다.
        
        console.log(this.myVar);   //수행 컨텍스트가 obj

        setTimeout(() =>  {            //화살표 함수, function() 객체가 만들어질 때 this 를 바인딩
            console.log(this.myVar);  //수행 컨텍스트가 obj
        }, 1000);
    },                      
};

obj.myFunc();
*/