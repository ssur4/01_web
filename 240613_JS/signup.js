
    const signinBtn = signupBtn.getElementById('signinBtn');
    signinBtn.addEventListener('click', function() {
    });

//

let userId = signupBtn.getElementById('inpuId').value;
let userPw = signupBtn.getElementById('inpuPw').value;
let userPwCheck = signupBtn.getElementById('inputPwCheck').value;
let userName = signupBtn.getElementById('inputName').value;
let social_num = signupBtn.getElementById('social_num').value; 
let address = signupBtn.getElementById('address').value; 
let phone_num = signupBtn.getElementById('phone_num').value; 
let email = signupBtn.getElementById('email').value; 


function signup(userId, userPw, userPwCheck, name, social_num, address, phone_num, email){

        //아이디 조건 : 한글이 들어가면 안된다.
        const userIdNameCheck = /^[a-zA-Z0-9]+$/;
        if (!userIdNameCheck.test(userId)) {
            alert('아이디를 다시 입력하세요. (영어와 숫자만 허용됩니다.)');
            return;
        }

        //비밀번호 일치여부  확인
        if (userPw !== userPwCheck){
            alert('비밀번호가 일치 하지 않습니다. 다시 입력해주세요');
            return;
        }

        //이름 조건 : 영어나 숫자가 들어가면 안됨
        if (!userIdNameCheck.test(name)) {
            alert('이름을 다시 입력하세요. (한글만 허용됩니다.)');
            return;
        }

        if (social_num.length !== 13) {
            alert("주민번호를 잘못 입력하셨습니다");
            return;
        }

        if (!email.includes('@')) {
            alert("이메일을 잘못 입력하셨습니다.");
            return;
        }
};