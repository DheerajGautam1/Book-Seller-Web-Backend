import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "../midleware/catchAsyncError.js";
import { generateToken } from "../utils/jwtToken.js";


//Register a User
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Plase Provide complete details."
    })
  } 
  
  const emailRegex = /^\S+@\S+\.\S+$/;
  if(!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format.",
    });
  }

  if(password.length < 6) {
     return res.status(400).json({
      success: false,
      message: "Password must  be at least 6 character long.",
    })
  }

  const isEmailAllreadyExist = await User.findOne({ email });
  if(isEmailAllreadyExist) {
     return res.status(400).json({
      success: false,
      message: "Email is already registered.",
    });
  }

  const user = await User.create({
    email,
    password
  });

  if (!user) {
    res.status(400);
    throw new Error('Failed to create user');
  }

  generateToken(user, "Registered Successfully", 201, res);
})

//Login User
export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
    res.status(400);
    throw new Error('Please fill all the fields');
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if(!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format.",
    });
  }

  const user = await User.findOne({ email }).select("+password");
    if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid Credential.",
    })
  }
  const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
    return res.status(400).json({
      success: false,
      message: "Invalid Credential.",
    })
  }

  generateToken(user, "Login Successfully", 200, res);
});

//Logout User
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).json({
        success: true,
        message: "Logged out successfully"
    });
})

//Get User 
export const getMyProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  })
})