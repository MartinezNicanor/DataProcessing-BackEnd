//external funct for email validate

import validateEmail from "./email.validator.api";


function isValidEmail(email: string): Boolean {
  if (!email) {
    return false;
  }

  //Required API to check if email is deliverable
  //! DONT FORGET TO UNCOMMENT AND CREATE NEW API KEY SINCE FREE TEIR IS ONLY 100 REQUESTS
  // (async () => {
  //   try {
  //   const info = await validateEmail(email);

  //   if(info && info.data.deliverability !== 'DELIVERABLE'){
  //     console.log('email is not deliverable');
  //     return false;
  //   }
 
  //   } catch (error) {
  //     console.error(error);
  //   }
  // })();

  //regex for email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
  
  //! DONT FORGET TO REMOVE THE PASSOWORD OPTION WHICH IS FOR TESTING
  function isValidPassword(password: string): Boolean {
    if (!password) {
      return false;
    }
    //regex for One capital, one lowercase letter one number, one special character and at least 6 characters
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (password == "password") {
      return true;
    }
    return passwordRegex.test(password);
  }

  function validateStrings(strings: string[]): boolean {
    for (const str of strings) {
      if (str === undefined || str.trim() === '') {
        console.error(`error: ${str} is not a valid string`);
        return false;
      }
    }
    return true;
  }

  function validateNumbers(numbers: number[]): boolean {
    for (const num of numbers) {
      if (num === undefined || num < 0) {
        console.error(`error: ${num} is not a valid number`);
        return false;
      }
    }
    return true;
  }

  function validateArrayStrings(arr: string[][]): boolean {
    for (const subArr of arr) {
        if (!subArr.every(item => typeof item === 'string' && item.trim() !== '')) {
            return false;
        }
    }
    return true;
  }

  function isValidTimeInterval(timeInterval: string) {
        const [hours, minutes, seconds] = timeInterval.split(':').map(Number);
        if (
            Number.isInteger(hours) && hours >= 0 && hours <= 23 &&
            Number.isInteger(minutes) && minutes >= 0 && minutes <= 59 &&
            Number.isInteger(seconds) && seconds >= 0 && seconds <= 59
        ) {
            return true;
        } else {
            return false;
        }

}

function languageValidator(language: string): boolean {
  const acceptedLanguages = ['English', 'French', 'Spanish', 'German', 'Italian', 'Russian', 'Hungarian', 'Dutch', 'Romanian', 'Polish'];

  if (acceptedLanguages.includes(language)) {
      return true;
  }
  return false;
}


  export {isValidEmail, isValidPassword, validateStrings, validateNumbers, validateArrayStrings, isValidTimeInterval, languageValidator};