# DataProcessing-BackEnd

## Backend Setup

### Requierments:

 - Docker Downloaded
 - On the project-setup branch and pulled latest
 
### Steps

1. Open VSCode in the project-setup branch
2. Clone the repository into your selected folder
3. Create a .env file in the root folder
4. Add the following information to it 

```
#Do NOT inlude inequality signs

POSTGRES_USER=admin
POSTGRES_PASSWORD=password
POSTGRES_HOST=localhost
POSTGRES_DB=netflix
POSTGRES_PORT=5432
JWT_SECRET=secret
MAILING_SERVICE_ADDRESS = nhlstenden.work@gmail.com
MAILING_SERVICE_APP_PASSWORD = ieykdgjbgcitkdpr
EMAIL_API_KEY = 580b14682491403ba15bc31a29301966
PORT = 3000
``` 
5. Open a termial in VSCode

6. Run the following code to download all the necessary packages

```
npm run i
```
7. Build the project (necessary for the creation of a dist folder from which our server runs from)
```
npm run build
```

8. From here on out, the server can be run with either
```
npm start
``` 

or 

```
npm run dev
```

9. if there are any problems with dependencies, manually uninstall them and install them again with the following commands:

```npm uninstall <packagename>```

```npm install <packagename>```

### Backend necessary information.

1. All of the neccessary requests can be found in the exported postman file. In order to use this file, import it into your own postman enviroment and change the enviroment variables to your personal ones in order to make its work. Fake email addresses are not going to work, password can be an actual password with one capital, one lower case letter, one number and one special character, and at least 6 characters long OR it can be just left as "password" which was left in to make testing easier.

2. The API for email validation is using a free tier service which only allows 100 requests maximum. after this expiers the email validation will throw errors. If you would like to continue testing on the backend, go to /src/utils/validators.ts and  comment out everything between lines 11-24. 

## Database setup