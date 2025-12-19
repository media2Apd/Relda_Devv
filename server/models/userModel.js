// const mongoose = require('mongoose');

// // Address schema as a subdocument schema
// const addressSchema = new mongoose.Schema({
//   street: { type: String },
//   city: { type: String, required: true },
//   state: { type: String, required: true },
//   country: { type: String, required: true },
//   pinCode: { type: String, required: true, default: '000000' },
//   default: { type: Boolean, default: false }
// });

// // User schema
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
//   role: { type: String, default: 'GENERAL' },
//   mobile: { type: String, required: true, unique: true },
//   addresses: [addressSchema], // Array of addresses
//   address: addressSchema, // Reflects the default or only address
// }, {
//   timestamps: true,
// });

// userSchema.pre('save', function (next) {
//   const user = this;

//   // If there are multiple addresses, find the default one.
//   const defaultAddress = user.addresses.find(addr => addr.default);

//   // If the default address exists, set it as the user's address.
//   if (defaultAddress) {
//     user.address = defaultAddress;
//   }

//   // Ensure only one address is marked as default in the array
//   user.addresses.forEach(addr => {
//     if (addr !== defaultAddress) {
//       addr.default = false;
//     }
//   });

//   // If no default is found but the user has one address, set that as the default.
//   if (!defaultAddress && user.addresses.length === 1) {
//     const singleAddress = user.addresses[0];
//     singleAddress.default = true;  // Set the only address as default
//     user.address = singleAddress;  // Set it to the user.address field
//   }

//   next();
// });

// // Pre-validate middleware to ensure only one address is marked as default
// userSchema.pre('validate', function (next) {
//   const user = this;

//   const defaultAddresses = user.addresses.filter(addr => addr.default);

//   // Enforce a single default address
//   if (defaultAddresses.length > 1) {
//     return next(new Error('Only one address can be marked as default.'));
//   }

//   next();
// });


// const userModel = mongoose.model("User", userSchema);

// module.exports = userModel;
const mongoose = require('mongoose');

// Address subdocument schema
const addressSchema = new mongoose.Schema({
  street: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pinCode: { type: String, required: true, default: '000000' },
  default: { type: Boolean, default: false }
});

// User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'GENERAL' },
  mobile: { type: String, required: true, unique: true },

  // Address fields
  addresses: [addressSchema],
  address: addressSchema,

  // ⭐ Wishlist field (Array of Product ObjectIds)
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product' // Reference to the Product model
    }
  ]
}, {
  timestamps: true,
});

// Set default address before saving
userSchema.pre('save', function (next) {
  const user = this;
  const defaultAddress = user.addresses.find(addr => addr.default);

  if (defaultAddress) {
    user.address = defaultAddress;
  }

  user.addresses.forEach(addr => {
    if (addr !== defaultAddress) {
      addr.default = false;
    }
  });

  if (!defaultAddress && user.addresses.length === 1) {
    const singleAddress = user.addresses[0];
    singleAddress.default = true;
    user.address = singleAddress;
  }

  next();
});

// Ensure only one default address
userSchema.pre('validate', function (next) {
  const user = this;
  const defaultAddresses = user.addresses.filter(addr => addr.default);

  if (defaultAddresses.length > 1) {
    return next(new Error('Only one address can be marked as default.'));
  }

  next();
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
