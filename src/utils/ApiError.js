
/*Step-by-Step Easy Explanation: ApiError Class
✅ Step 1: Custom Error Banana Kyu Zaroori Hai?
JavaScript ka built-in error throw new Error("message") sirf ek simple message deta hai.
Lekin jab aap API bana rahe hote hain, to aapko frontend ko proper format mein error bhejna hota hai jisme:

statusCode (jaise 400, 404, 500)

message (user ko dikhane ke laayak message)

success: false (error ke liye hamesha false)

errors: [list] (agar multiple issues hoon)

data: null (kyunki error mein data nahi bhejte)

Is liye hum ApiError class banate hain.

✅ Step 2: Class Shuru Karna
js
Copy
Edit
class ApiError extends Error {
Yahan hum ApiError naam ki class bana rahe hain jo JavaScript ki Error class se extend (inherit) karti hai.
Iska matlab hai ke ye normal error ki tarah behave karegi lekin hamare custom features bhi honge.

✅ Step 3: Constructor Banana
js
Copy
Edit
constructor(statusCode = "", message = "Something went Wrong", errors = [], stack = "")
Yahan 4 cheezein input le rahe hain:

Naam	Matlab
statusCode	Error ka HTTP code (jaise 404 - not found, 500 - server error)
message	Simple error ka message
errors	Detail wali error list, agar ho
stack	Jahan error hua uska trace (debug ke liye)

Agar ye cheezein na milein to default values use hongi.

✅ Step 4: Super Call Karna
js
Copy
Edit
super(message)
Ye Error class ke constructor ko call karta hai.
Isse base error message set hota hai.

✅ Step 5: Object Properties Set Karna
js
Copy
Edit
this.statusCode = statusCode
this.message = message
this.success = false
this.errors = errors
this.data = null
Isme hum apni error object ko standard bana rahe hain.
Jab ye error throw hoga to ye sari info frontend ko milegi.

success: false hamesha hota hai error ke liye.

data: null hota hai kyunki error mein data nahi bhejte.

✅ Step 6: Stack Trace Set Karna
js
Copy
Edit
if (stack) {
    this.stack = stack
} else {
    Error.captureStackTrace(this, this.constructor)
}
Agar developer ne custom stack diya ho to use karo, warna JavaScript se automatic bana lo.
Ye developer ko help karta hai debugging mein.

✅ Step 7: Export Karna
js
Copy
Edit
export { ApiError }
Isse hum is class ko dusri files mein import karke use kar sakte hain.

🔎 Real Life Example (Simple Case)
Sochiye ek user form submit karta hai lekin email nahi deta.

js
Copy
Edit
if (!req.body.email) {
    throw new ApiError(400, "Email is required", ["Missing email"])
}
API response frontend ko aise jayega:

json
Copy
Edit
{
  "statusCode": 400,
  "message": "Email is required",
  "success": false,
  "errors": ["Missing email"],
  "data": null
}
Ab frontend isko achi tarah show kar sakta hai — jaise ek alert: “Email is required”.

✅ Bonus: Error Handling Middleware (Recommended)
js
Copy
Edit
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || [],
        data: null
    });
};
Aap app.js mein last line pe ye use karein:

js
Copy
Edit
app.use(errorHandler);
Ab har jagah try/catch ki zarurat nahi. Bas likho:

js
Copy
Edit
throw new ApiError(403, "Not allowed", ["You are not an admin"])
🔚 Summary Table:
Step	Kya Karta Hai
class ApiError extends Error	Nayi custom error class banata hai
constructor(...)	Error ki detail set karta hai

Jab koi is class ka object banayega (e.g. new ApiError(400, "Missing email")), ye constructor() call hoga.


super(message)	Built-in error ka base message set karta hai

super(message)
✅ Ye JavaScript ki Error class ko uska message de deta hai.
➡️ Yani jab hum console.log(err) karein toh woh Error: message dikhaye.
this.statusCode	HTTP status code assign karta hai
this.success = false	Har error ke liye false hota hai
this.errors = []	Agar multiple errors hon
this.data = null	Error response mein data nahi hota
stack trace	Debugging ke liye location show karta hai
export	Class ko import karne ke laayak banata hai

Agar aap chaahein to mein aap ke liye:

Ek errorHandler.js file

Sample controller.js with ApiError

Working Express setup
tayar kar ke de sakta hoon. Bas batayein!*/


class ApiError extends Error {
    constructor(
        statusCode = "",
        message = "Something want Wrong",
        errors = [],
        stack = ""
    ) {
        super(message)
        this.statusCode = statusCode,
            this.message = message,
            this.success = false,
            this.errors = errors,
            this.data = null

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApiError }
