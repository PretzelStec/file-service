const mongoose = require("mongoose");

export interface Image {
    filename: string;
    userId: string;
}

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