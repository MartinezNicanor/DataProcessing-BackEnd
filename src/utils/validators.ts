//external funct for email validate


function isValidEmail(email: string): Boolean {
  if (!email) {
    return false;
  }
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

  export {isValidEmail, isValidPassword, validateStrings, validateNumbers, validateArrayStrings};