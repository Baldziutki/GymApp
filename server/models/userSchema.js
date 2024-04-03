import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        maxLength: 50,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    trainingLog: [{
        date: {
            type: Date,
            
        },
        exerciseDetails: [{
            name: {
                type: String,
            },
            sets: [{
                weight: {
                    type: Number,
                },
                reps: {
                    type: Number,
                },
                distance: {
                    type: Number,
                },
                time: {
                    type: Number,
                }
            }],
        }],
    }],
    exercise: [{
        name: {
            type: String,
        },
        category: {
            type: String,
        },
        type: {
            type: String,
        },
        description: {
            type: String,
        },
    }],
    routine: [{
        name: {
            type: String,
        },
        exercise: [{
            name: {
                type: String,
            },
            category: {
                type: String,
            },
            type: {
                type: String,
            },
            description: {
                type: String,
            },
        }]
    }]

});


userSchema.plugin(uniqueValidator);

export const UserModel = mongoose.model('User', userSchema);