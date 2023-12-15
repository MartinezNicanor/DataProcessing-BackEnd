//external funct for email validate


function isValidEmail(email: string): Boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  //! DONT FORGET TO REMOVE THE PASSOWORD OPTION WHICH IS FOR TESTING
  function isValidPassword(password: string): Boolean {
    //regex for One capital, one lowercase letter one number, one special character and at least 6 characters
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (password == "password") {
      return true;
    }
    return passwordRegex.test(password);
  }

  export {isValidEmail, isValidPassword};