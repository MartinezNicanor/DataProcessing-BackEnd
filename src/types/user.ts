export interface User {
    account_id: number;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    payment_method: string;
    subscription_id: number;
    blocked: boolean;
    verified: boolean;
    street: string;
    zip_code: string;
    country_id: number;
    log_in_attempt_count: number;
    invited: boolean;
    usertype: string; 
  }


export interface Profile {
    profile_id: number,
    account_id: number,
    profile_name: string,
    age: number,
    path_to_image: string,
    language: string,
    preferences : {
      movies: string[],
      series: string[],
      genres: string[],
      min_age: number[],
      viewing_class: string[] 
    } 
}

export interface Subscription {
  subscription_id: number,
  subscribed: boolean,
  type: string,
  price: number,
  date: string,
}



