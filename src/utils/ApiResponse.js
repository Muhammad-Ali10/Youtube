class ApiResponse {
    constructor(statusCode,  data, message= "Success"){
        this.statusCode = statusCode,
        this.data = data, 
        this.message = message,
        this.success =  statusCode < 400
    }
}

/*Aapke screenshot mein ApiResponse class likhi gayi hai jo successful API responses ko handle karne ke liye use hoti hai. Chaliye isko step-by-step Roman Urdu mein samajhte hain (beginner-friendly explanation ke sath):

🧾 Code:
js
Copy
Edit
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode
    this.data = data
    this.message = message
    this.success = statusCode < 400
  }
}
🧠 Roman Urdu Explanation:
1️⃣ class ApiResponse
Ye ek custom class hai jo response object banane ke liye use hoti hai — jab API successfully kaam kar le.

2️⃣ constructor(statusCode, data, message = "Success")
Jab aap new ApiResponse() likhenge, to ye values chahiye hongi:

statusCode: Jaise 200, 201

data: Jo bhi data client ko dena hai

message: Optional message (default "Success")

3️⃣ this.statusCode = statusCode
Response object ka status code set karega.

4️⃣ this.data = data
Jo bhi data (e.g., user object, list, etc.) bhejna ho — wo yahan save hoga.

5️⃣ this.message = message
Aapka success message yahan set hota hai. Default hai "Success".

6️⃣ this.success = statusCode < 400
Yeh smart line hai. Agar statusCode 400 se chhota hai, to iska matlab request successful thi.

✅ 200, 201, etc. → success: true

❌ 400, 401, 500 → success: false

✅ Output Example:
js
Copy
Edit
new ApiResponse(200, { user: "Ali" }, "User fetched successfully")

// Resulting object:
{
  statusCode: 200,
  data: { user: "Ali" },
  message: "User fetched successfully",
  success: true
}
🔄 Combine with ApiError
✅ ApiResponse → Success responses ke liye

❌ ApiError → Error responses ke liye

Aapka backend ab dono tarah ke response objects consistently bhej sakta hai!

Agar aap chahen to mai ek ready-made utility function bana deta hoon jo res.status().json() ke sath use hota hai.*/ 