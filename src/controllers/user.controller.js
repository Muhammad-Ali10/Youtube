import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"

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

  const { fullName, email, username, password } = req.body
  //console.log("email: ", email);

  if ([fullName, email, username, password].some((feild)=> feild?.trim() === "")) {
      throw new ApiError(400, "All is requried")
  }

})

export { registerUser }



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