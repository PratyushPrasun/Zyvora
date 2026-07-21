import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// const addressSchema = new mongoose.Schema(
//   {
//     fullName: String,
//     phone: String,
//     address: String,
//     city: String,
//     state: String,
//     pincode: String,
//     country: {
//       type: String,
//       default: "India",
//     },
//   },
//   { _id: false }
// );

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    phone: {
      type: String,
      default: "",
    },

    // addresses: [addressSchema],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error; // propagates as a rejected promise, save() will fail with this error
  }
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);