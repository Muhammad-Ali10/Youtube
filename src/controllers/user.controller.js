import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { fileUploader } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { fileDelete } from "../utils/deleteCloudinary.js"
import mongoose from "mongoose"

const generateAccessTokenandRefreshToken = async (userid) => {

  //iss function ma userid say user find ka raya ga or phir us user ko us ka refresh token or access token da ga
  // Hum ek asynchronous function bana rahe hain jo userId lega aur dono tokens return karega.
  // Ye function backend ke andar kisi bhi controller se call kiya ja sakta hai — like login ya refresh ke waqt.

  const user = await User.findById(userid)

  // Is line mein hum MongoDB se User model ke zariye user ko uske _id se find kar rahe hain.
  // Ye is liye zaroori hai ke humein user ki info chahiye accessToken banane ke liye.

  const accessToken = user.generateAccessToken(user)
  //Yahan hum generateAccessToken() function ko call kar rahe hain jo JWT access token banata hai.
  // Usko user object diya gaya hai jisme _id, email, username, fullName hota hai.
  // Ye sari info JWT ke payload mein encode hoti hai.

  const refreshToken = user.generateRefreshToken(user)

  //   Ye line refresh token generate karti hai, lekin isme sirf _id hota hai.
  // Refresh token usually zyada secure aur long-lived hota hai — like 7 din tak valid

  const bcryptRefreshToken = await bcrypt.hash(refreshToken, 10)

  user.refreshToken = bcryptRefreshToken
  // Yahan hum user ke document mein refreshToken ko save kar rahe hain (in MongoDB).
  // Iska matlab hai ke user ka token ab database mein bhi save ho gaya, taake refresh ke waqt match kar sakein.

  await user.save({ validateBeforeSave: true })
  //   Yahan hum user ko database mein save kar rahe hain, lekin validateBeforeSave: false diya hai
  // taake mongoose phir se saari fields validate na kare (kyunke hum sirf refreshToken update kar rahe hain)

  return { accessToken, refreshToken }

}

const registerUser = asyncHandler(async (req, res) => {

  // get user details from frontend
  // validation this data -no empty
  // check user already exists  with username and email
  // check for images check for avatar
  // check images upload to cloudinary avatar
  // create a user object create entry in db
  // remove password and refresh token field from response
  // check for user creation 
  // return response

  //console.log("req.body: ", req.body);

  const { fullName, email, username, password } = req.body


  if ([fullName, email, username, password].some((feild) => feild?.trim() === "")) {
    throw new ApiError(400, "All is requried")
  }


  const existsUser = await User.findOne({
    $or: [{ username }, { email }]
  })


  if (existsUser) {
    throw new ApiError(409, "User is alreay exists")
  }

  const avatarlocalpath = await req?.files?.avatar?.[0]?.path
  //const coverImagelocalpath = await req?.files.coverImage[0]?.path
  //console.log("req.files", req.files)


  let coverImagelocalpath;

  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImagelocalpath = await req.files.coverImage[0].path
  }



  if (!avatarlocalpath) {
    throw new ApiError(500, "Some thing want Wrong")
  }

  const avatar = await fileUploader(avatarlocalpath)

  const coverImage = await fileUploader(coverImagelocalpath)



  if (!avatar) {
    throw new ApiError(400, "Avatar requried ")
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    avatarId: avatar.public_id,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })
  //console.log("user data "+ user)

  const createduser = await User.findById(user._id).select("-password -refreshToken")

  if (!createduser) {
    throw new ApiError(500, "Something went wrong while registred")
  }

  return res.status(201).json(
    new ApiResponse(200, createduser, "User SuccessFull created")
  )

})

const loginUser = asyncHandler(async (req, res) => {


  //get user data for body 
  //username or emali
  //find user 
  //password check
  //access token and refersh token
  //save in cookies

  const { username, email, password } = req.body
  // console.log(req?.body)


  if (!username || !email) {
    throw new ApiError(400, "All is requried")
  }

  const user = await User.findOne({
    $or: [{ username, email }]
  })

  if (!user) {
    throw new ApiError(409, "User does not exist")
  }
  //iss time is ka pass refresh token ni ha or hum na nich iss user ko updata ke a ha jis ma refresh token ha
  //console.log(user)

  const isPasswordValidate = await user.isPasswordCorrect(password)

  if (!isPasswordValidate) {
    throw new ApiError(409, "Password is wrong")
  }

  const { accessToken, refreshToken } = await generateAccessTokenandRefreshToken(user._id)

  //const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
  //iss place py hum na updata ke ha user ko

  // const user = await User.findById(id)
  // To user ek Mongoose document hota hai — isme sirf data hi nahi, balke Mongoose ke extra methods bhi hotay hain jaise .save(), .validate(), etc.

  // Lekin agar aapko sirf user ka asal data chahiye (jo DB mein hai), to aap use karte ho:
  // user._doc
  const loggedInUser = { ...user._doc }
  // console.log(loggedInUser)

  delete loggedInUser.password
  delete loggedInUser.refreshToken


  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict"
  }

  return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {
      user: loggedInUser,
      accessToken,
      refreshToken
    }, "User logged in successfully"))


})


const logoutUser = asyncHandler(async (req, res) => {

  await User.findByIdAndUpdate(req.user._id, {
    refreshToken: undefined // Yahan hum user ke refreshToken ko undefined set kar rahe hain, taake wo logout ho jaye.
  }, { new: true })

  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logout successfull"))

})

const refershAccessToken = asyncHandler(async (req, res) => {
  //get refersh token from user 
  //Check user have a refers token 
  // decoded user refersh token
  //and check the refersh token is valid
  //if refersh token is valid the incomingrefershToken is not different with databaserefersh token
  //then set new access token and refersh token 
  //  const incomingrefershTokens = req.cookies.refreshToken || req.body.refreshToken
  //   console.log("imcomm",incomingrefershTokens)

  const incomingRefreshToken = (req.cookies?.refreshToken) || (req.body?.refreshToken);

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized access");
  }


  try {

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // STEP 2: Compare hashed refresh token stored in DB
    const isTokenValid = await bcrypt.compare(incomingRefreshToken, user.refreshToken);

    if (!isTokenValid) {
      throw new ApiError(403, "Refresh token mismatch");
    }

    const { accessToken, refreshToken } = await generateAccessTokenandRefreshToken(user._id);

    return res.status(200)
      .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
      .json(new ApiResponse(200, { accessToken, refreshToken }, "Tokens refreshed successfully"));

  } catch (error) {
    throw new ApiError(401, "Invalid Refresh Token");
  }
})


const updatepassword = async (req, res) => {
  // get user new password and oldpassword 
  //ab user check kr na jis na ya password change kr wa na ha
  //or agar user login ho ga to wo password change kr pay ga 
  //or phir user ko database ma password lay ga or old password say match kr wa ga 
  //agar ho ga to new password ko bycrypt kr ka database ma save ka da ga
  // ek response send ka da ga

  const { oldpassword, newpassword } = req.body

  const user = await User.findById(req.user?._id)

  const PasswordCorrect = await user.isPasswordCorrect(oldpassword)

  if (!PasswordCorrect) {
    throw new ApiError(401, "Old Password Is wrong")
  }

  user.password = newpassword
  await user.save({ validateBeforeSave: true })

  return res.status(200)
    .json(new ApiResponse(200, {}, "Password Change success fully"))
}

const getcurrentuser = asyncHandler(async (req, res) => {

  return res.status(200)
    .json(new ApiResponse(200, req.user, "Current user id fetch"))

})

const updateaccountdetalis = asyncHandler(async (req, res) => {

  console.log(req.body)

  const { fullName, email } = req.body


  try {
    if (!fullName || !email) {
      throw new ApiError(404, "Email or password is requried")
    }

    const user = await User.findByIdAndUpdate(req.user._id,
      {
        $set: {
          fullName,
          email
        }
      },
      {
        new: true
      }
    ).select("-password")

    return res.status(200)
      .json(new ApiResponse(200, user, "User Updated"))

  } catch (error) {
    throw new ApiError(404, error.message || "Something went wrong")
  }
})

const updateaccountimage = asyncHandler(async (req, res) => {
  {

    try {
      const avatar = req.file.path

      if (!avatar) {
        throw new ApiError(409, "Avatar is requried ")
      }

      const avatarlocalpath = await fileUploader(avatar)

      console.log(avatarlocalpath)
      if (!avatarlocalpath) {
        throw new ApiError(500, "Something went wrong")
      }

      console.log(req.user)

      const oldAvatar = req.user.avatarId


      const user = await User.findByIdAndUpdate(req.user._id,
        {
          $set: {
            avatar: avatarlocalpath.url
          }
        },
        {
          new: true
        }
      ).select("-password")

      if (!user) {
        throw new ApiError(500, "Something went wrong")
      }

      await fileDelete(oldAvatar)


      return res.status(200).json(new ApiResponse(200, user, "done"))
    } catch (error) {
      throw new ApiError(404, error.message || "Something went wrong")
    }
  }
})

const UpdateCoverImage = asyncHandler(async (req, res) => {
  try {
    const coverImage = req.file.path
    if (!coverImage) {
      throw new ApiError(409, "Cover Image is requried ")
    }

    const coverImagelocalpath = await fileUploader(coverImage)

    if (!coverImagelocalpath) {
      throw new ApiError(500, "Something went wrong")
    }

    const user = await User.findByIdAndUpdate(req.user._id, {
      $set: {
        coverImage: coverImagelocalpath.url
      }
    }, {
      new: true

    }).select("-password")

    if (!user) {
      throw new ApiError(500, "Something went wrong")
    }

    return res.status(200).json(new ApiResponse(200, user, "done"))
  } catch (error) {
    throw new ApiError(404, error.message || "Something went wrong")
  }
})

const getUserProfile = asyncHandler(async (req, res) => {

  const { userId } = req.params

  const user = await User.findById(userId)


  const Channel = User.aggregate([
    {
      $match: {
        _id: userId
      },
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers"
      },


      // 👉 "ab users collection ke andar jo _id hai,
      // usay subscriptions collection ke channel field ke saath match karo.
      // agar subscriptions.channel ka value users._id ke barabar milta hai,
      // to us subscription record ko uthao
      // aur ek naye array subscribers mai daal do."

      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscriberTo"
      },
      $addFields: {
        subscribersCount: {
          $size: "$subscribers"
        },
        subscriberToCount: {
          $size: "$subscriberTo"
        },
        isSubscribed: {
          $cond: {
            if: {
              $in: [req.user._id, "$subscribers.subscriber"]
            },
            then: true,
            else: false
          }
        }
      },
      $project: {
        fullName: 1,
        username: 1,
        avatar: 1,
        subscribersCount: 1,
        subscriberToCount: 1,
        isSubscribed: 1,
        email: 1,
        createdAt: 1,
      }

    }
  ])
  if (!Channel?.length) {
    throw new ApiError(404, "Channel not found")
  }

  return res.status(200).json(new ApiResponse(200, Channel[0], "done"))
})


const getUserWatchHistory = asyncHandler((req, res) => {

  const user = user.aggregate({
    $match: {
      _id: mongoose.Types.ObjectId(req.user._id)
    },
    $lookup: {
      from: "videos",
      localField: "watchHistory",
      foreignField: "_id",
      as: "watchHistoryDetails",
      pipeline: [
        {
          $lookup: {
            from: "users",
            localField: "watchHistoryDetails.owner",
            foreignField: "_id",
            as: owner,
            pipeline: [
              {
                $project: {
                  fullName: 1,
                  username: 1,
                  avatar: 1
                }
              }
            ]
          },
          $addFields: {
            owner: {
              $first: "$owner"
            }
          }
        },
      ]
    },
  })
})




// 👉 "ab users.watchHistory array ke andar jitne video IDs hain,
// unko videos collection ke _id field ke saath match karo.
// agar koi match hota hai to us video ki details uthao
// aur ek naye array watchHistoryDetails mai daal do."
//11:31 py battery one on ha
export {
  registerUser,
  loginUser,
  logoutUser,
  refershAccessToken,
  updatepassword,
  getcurrentuser,
  updateaccountdetalis,
  updateaccountimage,
  UpdateCoverImage
}



















/*Ye ek helper function hai jo aapke async controllers ko automatically error handle karne ki salahiyat deta hai.
Is se aapko har route ke andar try/catch likhne ki zarurat nahi padti.

📘 asyncHandler Function Line-by-Line (Urdu Roman)
js
Copy
Edit
const asyncHandler = (requestHandler) => {
Yahan hum ek function bana rahe hain jo kisi bhi controller function ko input lega.

js
Copy
Edit
  return (req, res, next) => {
Ye function return karta hai ek naya function jo Express ke route jaisa hota hai — req, res, next leta hai.

js
Copy
Edit
    Promise.resolve(requestHandler(req, res, next))
Yahan hum aapka async function run karte hain aur use Promise.resolve() ke andar lapet dete hain, taake agar wo kisi async kaam (jaise DB query) mein fail ho jaye to error catch ho sake.

js
Copy
Edit
    .catch((error) => next(error))
Agar async function mein koi error aaye, to wo is .catch ke zariye pakda jata hai aur next(error) ke through Express ko de diya jata hai.
Express phir usay error middleware mein bhej deta hai.

js
Copy
Edit
  }
}
Function band ho gaya.

js
Copy
Edit
export { asyncHandler }
Ab is function ko kisi bhi controller file mein import karke use kiya ja sakta hai.

📘 Controller Mein Use Karna
js
Copy
Edit
import { asyncHandler } from "../utils/asyncHandler.js"

const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "ok" })
})

export { registerUser }
Iska Matlab:
registerUser ek async function hai.

Humne use asyncHandler ke andar wrap kiya.

Agar iske andar koi error aaye (jaise DB down ho ya required field na ho), to wo catch hoke Express ke error handler tak chala jaye ga — bina try/catch likhe.

🎯 Real-life Misaal:
Sochiye aap ke pass ek form hai jahan user register hota hai.

Aap likhte:

js
Copy
Edit
const registerUser = asyncHandler(async (req, res) => {
  const user = await createUser(req.body)
  res.status(201).json(user)
})
Agar createUser() fail ho jaye (jaise email duplicate ho), to error khud-ba-khud pakda jaye ga aur response milega:

json
Copy
Edit
{
  "message": "Duplicate email found",
  "statusCode": 400
}
Aur aapko try/catch likhne ki zarurat nahi.

🧠 Faiday:
✅ Code clean aur chhota rehta hai
✅ Har controller mein error safe hota hai
✅ Express ke error middleware se proper response milta hai
✅ Developer ka kaam kam ho jata hai*/