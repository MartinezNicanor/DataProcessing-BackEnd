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

POSTGRES_USER=<YOUR USERNAME>
POSTGRES_PASSWORD=<YOUR PASSWORD>
POSTGRES_DB=db

PORT = 3000
``` 
4. Open a termial in VSCode
5. Run the following code and wait or it to download

```
docker build -t node .
```
6. Run the following and wait for it to download and it should run everything automatically
```
docker compose up
```