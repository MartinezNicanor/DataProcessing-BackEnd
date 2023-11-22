import { app } from './app'

//seperate server file to prevent openhandle testing problem w jest

const port = process.env.PORT || 3000;

const server = app.listen(port, () => console.log(`server is running on port ${port}`));

