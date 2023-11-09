import { Error, Schema, model } from "mongoose";
import { UserDocument } from "../types/user.interface";
import bcryptjs from "bcryptjs";

const userSchema = new Schema<UserDocument>({
    email:
    {
        type: String,
        clearIndexes: {
            unique: true
        }
    },
    username: {
        type: String
    },
    password:
    {
        type: String,
        select: false
    },

}, { timestamps: true });

userSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        return next();
    }
    try {
        const salt =await  bcryptjs.genSalt(10);
        this.password= await bcryptjs.hash(this.password, salt);
        return next();
    } catch (error) {
        return next(error as Error)
    }
})

userSchema.methods.validatePassword = function (password: string){
    return bcryptjs.compare(password, this.password);
}

export default model<UserDocument>('User', userSchema);

// const user = new User({email:'', username:'', password:''})
// user.save();
// user.validatePassword();