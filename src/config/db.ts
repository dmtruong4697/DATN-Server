import mongoose, { ConnectOptions } from "mongoose";

export function connectDB() {

    const url = "mongodb+srv://truonggduonggmadridista:nOXuMYvDxGhwMu2C@datn.oi09cza.mongodb.net/?retryWrites=true&w=majority&appName=DATN"
    
    try {
        mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions);
    } catch (error) {
        let errorMessage = "Failed to do something exceptional";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        console.log(errorMessage);
        process.exit(1);
    }

    const dbConnection = mongoose.connection;
    dbConnection.once("open", (_) => {
        console.log(`Database connected: ${url}`);
    });

    dbConnection.on("error", (err) => {
        console.error(`connection error: ${err}`);
    });

    return;
}