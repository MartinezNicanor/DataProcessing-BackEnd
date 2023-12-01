import app from './app';

const port: number = parseInt(process.env.PORT!) || 3000;
console.log(`Using port: ${port}`);

const server = app.listen(port, () => console.log(`server is running on port ${port}`));

// Handle server termination gracefully
process.on('SIGINT', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing http server.');
    server.close(() => {
        console.log('Http server closed.');
    });
});
