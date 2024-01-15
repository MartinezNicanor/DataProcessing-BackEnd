# DataProcessing-BackEnd

## Setup

### Requierments:

 - Docker Downloaded
 - On the project-setup branch and pulled latest
 
### Steps

1. Open VSCode in the project-setup branch
2. Create a .env file in the root folder
3. Add the following information to it 

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
EMAIL_API_KEY = 9fffb9f220754101ab765d427898c3c7 !!!!! UPDATE TO THE NEW ONE BEFORE SUUBMISSION
PORT = 3000
``` 
4. Open a termial in VSCode

5. Run the following code to download all the necessary packages

```
npm run i
```
6. Build the project (necessary for the creation of a dist folder from which our server runs from)
```
npm run build
```

7. From here on out, the server can be run with either
```
npm start
``` 

or 

```
npm run dev
```

8. In order to have the database set up, postgres will need to be downloaded and ran locally. 
Make sure that the port is set to 5432, and that a user named: "admin" with the password: "postgres" is created.

9. A copy of the database can be found in :
    - /root
        - /postgreSQL
            - /netflix.sql

10. After creating the database, dummy data can be found in
    - /root
        - /postgreSQL
            - /dummy-data.sql

## Commands to use

1. When working on the code, you can run it by 
``` npm run dev ```
This command initiates an instance of nodemon and TypeScript (tsc) concurrently. It continuously monitors your codebase, automatically updating and recompiling TypeScript changes into JavaScript. It makes its so the only thing you need to do to apply changes is to save your code.

2. Before commiting code to VCS run ``` npm run build ``` This script clears the dist folder, ensuring a clean slate, and then recompiles all TypeScript files into JavaScript for a fresh build. This step helps catch potential issues early and ensures that the committed code is ready for deployment.

3. ```npm start ``` This command executes the compiled JavaScript file in the dist folder, providing a stable and optimized version of your application for deployment or production use. Use this command when preparing to deploy or when running the application in a production environment.

4. To check if your test that you wrote passed just type ```npm t``` or ```npm test```

5. Generating Test Coverage Reports:
For a comprehensive understanding of your code coverage, you can generate a coverage report using the following command:
```npm t -- --coverage```
This command runs your tests while collecting coverage information. The coverage report is then generated and can be found in a designated directory (often named coverage). Open the HTML files in your browser to explore detailed information about which parts of your code are covered by tests and which may need additional attention.

6. To delete all of your current docker containers run ```docker system prune -a``` 
