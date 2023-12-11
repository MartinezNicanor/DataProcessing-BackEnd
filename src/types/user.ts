export interface User {
    account_id: string;
    email: string;
    first_name: string;
    last_name: string;
    user_password: string;
    usertype: string;
    blocked: boolean;
    verified: boolean;

    //THIS SHOULD MATCH DB 1 to 1 so that user object can be applied to this
  }