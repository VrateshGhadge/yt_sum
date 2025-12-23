const mongoose = require('mongoose');
const  Schema  = mongoose.Schema;
const bcrypt =  require('bcrypt')

 const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }

},{ timestamps: true });

userSchema.pre('save', async function () {
    // Only hash if password is new or modified
    if (!this.isModified('password')) return; 

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

})
userSchema.methods.comparePassword = function(enteredPassword){
    return bcrypt.compare(enteredPassword, this.password);
}
module.exports = mongoose.model('User', userSchema);