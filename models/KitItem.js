const mongoose = require("mongoose");

const KitItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide item name"],   
            trim: true,
            maxlength: 50,
        },
        quantity: {
            type: Number,
            required: [true, "Please provide quantity"],    
            min: 0,
            default: 1,
        },
        lowStockThreshold: {
            type: Number,
            default: 1, 
            min: 0,
        },
        category: {
            type: String,
            enum: ["snack","meal","drink","other","breakfast","lunch","dinner"],
            default: "other",   
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide user"],    
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("KitItem", KitItemSchema);


        
                
           
        
    
