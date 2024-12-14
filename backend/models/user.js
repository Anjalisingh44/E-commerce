const mongoose = require("mongoose");
const {Schema} = mongoose;
const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Enter the username"],
    },
    email: {
        type: String,
        required: [true, "Enter the email"],
        unique: [true, "Email address already taken"],
    },
    password: {
        type: String,
        required: [true, "Enter the password"],
    },
    address: {
        type: String,
        
    },
    addresses:[
        {
city:{type: String, required:true},
        },

    ],
    role: {
        type: String,
        enum: ['user', 'admin'],  
        default: 'user',          
      },
      wishlist:[
       {
        type: mongoose.Schema.Types.ObjectId,  // Array of ObjectIds to reference products
        ref: "products",                  // Assuming "Product" is the model name for products
                            // Default value is an empty array
    }
],
    
}, {
    timestamps: true,
});
   const user = mongoose.model('user', userSchema);

userSchema.pre("save", function (next) {
    if(!this.isModified) return next
    
}
)

module.exports = user;

