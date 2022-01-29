const mongoose = require("mongoose");

export interface Image {
    filename: string;
    userId: string;
}

export interface User {
    email: string;
    password: string;
    username: string;
    images: Image[];
    profilePicture?: string;
}

const userSchema = mongoose.Schema({
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        require: true,
    },
    profilePicture: String
});

export const userModel = mongoose.model("user", userSchema);

// just a basic model to get the query to work.
const imageSchema = mongoose.Schema({
    filename: {
        type: String,
        require: true,
    },
    metadata: {
        type: Object
    },
    uploadDate: {
        type: Date,
    }
});

export const imageModel = mongoose.model("bucket.files", imageSchema);