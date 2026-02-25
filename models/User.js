const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide name"],
            minlength: 2,
            maxlength: 50,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please provide email"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please provide a valid email",
            ],
        },
        password: {
            type: String,
            required: [true, "Please provide password"],
            minlength: 6,
        },
    },
    { timestamps: true }
);

UserSchema.pre("save", async function () {
        if (!this.isModified("password")) return;
        const salt = await bycrypt.genSalt(10);
        this.password = await bycrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
