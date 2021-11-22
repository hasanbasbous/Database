// function validate(){
    const fName = document.getElementById("register-first-name")
    const lName = document.getElementById('register-last-name')
    const email = document.getElementById('register-email')
    const passwordEl = document.getElementById('register-password')
    const confirmPasswordEl = document.querySelector('#register-repeat-password')
    const driverLicenseIdEl = document.getElementById('register-drivers-license-id')
    const maleBtnEl = document.getElementById('register-male')
    const femaleBtnEl = document.getElementById('register-female')
    // const genderEl = document.querySelectorAll('input[name=register-gender]');

    const submitBtn = document.querySelector('#submitBtn')
    const form = document.querySelector('#register')

    submitBtn.addEventListener('click', function(e) {
        // e.preventDefault() //prevent submitting of the form
        // validate fields
        // console.log(1)
    let isfnameValid = checkfName(),
    islnameValid = checklName(), 
    isEmailValid = checkEmail(),
    isPasswordValid = checkPassword(),
    isConfirmPasswordValid = checkConfirmPassword(),
    isLicenseNumberValid = checkLiscenceNumber()
    isGenderSelected = checkGenderChosen();

let isFormValid = 
    isfnameValid &&
    islnameValid &&
    isEmailValid &&
    isPasswordValid &&
    isConfirmPasswordValid &&
    isLicenseNumberValid &&
    isGenderSelected;

// submit to the server if the form is valid
    if (isFormValid) {
        window.location.replace("http://localhost:5000/auth/register")
    }
});


const debounce = (fn, delay = 500) => {
let timeoutId;
return (...args) => {
    // cancel the previous timer
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    // setup a new timer
    timeoutId = setTimeout(() => {
        fn.apply(null, args)
    }, delay);
};
};

form.addEventListener('input', debounce(function (e) {
switch (e.target.id) {
    case 'register-first-name':
        checkfName();
        break;
    case 'register-last-name':
        checklName();
        break;
    case 'register-email':
        checkEmail();
        break;
    case 'register-password':
        checkPassword();
        break;
    case 'register-repeat-password':
        checkConfirmPassword();
        break;
    case 'register-drivers-license-id':
        checkLiscenceNumber();
        break;
    case 'register-male':
        checkGenderChosen();
        break;
    case 'register-female':
        checkGenderChosen();
        break;
}
}));



    const isEmailValid = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    const isPasswordSecure = (password) => {
        const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        return re.test(password);
    };

    const showError = (input, message) => {
        // get the form-field element
        const formField = input.parentElement;
        // add the error class
        formField.classList.remove('success');
        formField.classList.add('error');
    
        // show the error message
        const error = formField.querySelector('small');
        error.textContent = message;
    };

    const showSuccess = (input) => {
        // get the form-field element
        const formField = input.parentElement;
    
        // remove the error class
        formField.classList.remove('error');
        formField.classList.add('success');
    
        // hide the error message
        formField.querySelector('small').textContent = ''
        // const error = formField.querySelector('small');
        // error.textContent ='hasan';
    }

    const isRequired = value => value === '' ? false : true;

    const nameCheck = name => {
        const pattern =  /^[A-Za-z]+$/
        return pattern.test(name)
    }  

    const checkfName = () => {

        let valid = false;
        const firstName = fName.value.trim();
    
        if (!isRequired(firstName)) {
            showError(fName, 'Username cannot be blank.');
        } else if (!nameCheck(firstName)) {
            showError(fName, 'Name must be all alphabets.')
        } else {
            showSuccess(fName);
            valid = true;
        }
        return valid;
    }

    const checklName = () => {

        let valid = false;
        const lastName = lName.value.trim();
    
        if (!isRequired(lastName)) {
            showError(lName, 'Username cannot be blank.');
        } else if (!nameCheck(lastName)) {
            showError(lName, 'Name must be all alphabets.')
        } else {
            showSuccess(lName);
            valid = true;
        }
        return valid;
    }

    const checkEmail = () => {
        let valid = false;
        const e = email.value.trim();
        if (!isRequired(e)) {
            showError(email, 'Email cannot be blank.');
        } else if (!isEmailValid(e)) {
            showError(email, 'Email is not valid.')
        } else {
            showSuccess(email);
            valid = true;
        }
        return valid;
    }

    const checkPassword = () => {

        let valid = false;
    
        const password = passwordEl.value.trim();
    
        if (!isRequired(password)) {
            showError(passwordEl, 'Password cannot be blank.');
        } else if (!isPasswordSecure(password)) {
            showError(passwordEl, 'Password must has at least 8 characters that include at least 1 lowercase character, 1 uppercase characters, 1 number, and 1 special character in (!@#$%^&*)');
        } else {
            showSuccess(passwordEl);
            valid = true;
        }
    
        return valid;
    };

    const checkConfirmPassword = () => {
        let valid = false;
        // check confirm password
        const confirmPassword = confirmPasswordEl.value.trim();
        const password = passwordEl.value.trim();
    
        if (!isRequired(confirmPassword)) {
            showError(confirmPasswordEl, 'Please enter the password again');
        } else if (password !== confirmPassword) {
            showError(confirmPasswordEl, 'Confirm password does not match');
        } else {
            showSuccess(confirmPasswordEl);
            valid = true;
        }
    
        return valid;
    };

    const checkLiscenceNumber = () => {
        let valid = false
        const driverLicenseId = driverLicenseIdEl.value.trim();
        const pattern = /^[0-9]{9}$/

        if(!isRequired(driverLicenseId)){
            showSuccess(driverLicenseIdEl)
            valid = true;
        } 
        else { //user didn't keep it empty
            if(!pattern.test(driverLicenseId)){
                showError(driverLicenseIdEl, 'Liscence number should be nine digits.')
            } else {
                showSuccess(driverLicenseIdEl);
                valid = true;
            }
        }
        return valid;
    };


    const checkGenderChosen = () => {
        let valid = false;
        // let selectedValue;
        // for(const gender of genderEl){
        //     if(gender.checked){
        //         selectedValue = gender.value;
        //         valid = true;
        //         break;
        //     }
        // }
        // if(!valid){
        //     showError(genderEl.item(0), "Choose gender.")
        // } else {
        //     showSuccess(genderEl.item(0));
        // }
        if(!(maleBtnEl.checked || femaleBtnEl.checked))
            showError(femaleBtnEl, "Choose gender.")
        else {
            valid = true;
            showSuccess(femaleBtnEl);
        }

        return valid;
        
    }
// }
