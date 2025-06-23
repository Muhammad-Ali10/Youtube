const asyncHandler = (requestHandler) => {
  return  (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error))
    }
}
 

export { asyncHandler }

//const asyncHandler = ()=>{}
//const asyncHandler = (fun)=> () => {}
//const asyncHandler = (fun)=> async()=>{}

/*const asyncHandler = (fun) => async (req, res, next) => {
    try {
        await fun(req, res, next)
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}*/

/* const asyncHandler = (fun) => async (req, res, next) => {
    try {
        await fun(req, res, next)
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}*/


/* asyncHandler Kya Hai?
asyncHandler aik higher-order function hai — matlab aisa function jo doosray function ko as argument leta hai aur aik naya function return karta hai.

Yeh Express.js mein async route handlers ke errors ko handle karne ke liye use hota hai.

📜 Code:
js
Copy
Edit
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise
            .resolve(requestHandler(req, res, next))
            .catch((error) => next(error));
    }
};
🧠 Tashreeh (Line-by-Line)
const asyncHandler = (requestHandler) => {
Ye function ka naam asyncHandler hai, jo aik requestHandler function ko as argument leta hai — yaani aapka route ka async function.

return (req, res, next) => {
Ye aik naya function return karta hai jo Express ka middleware format follow karta hai — yaani req, res, aur next ko accept karta hai.

Promise.resolve(requestHandler(req, res, next))
Yahan aapka requestHandler run hota hai (jaise async (req, res) => {})
Usay Promise.resolve mein wrap kiya gaya hai — taake agar wo async function ho ya normal, dono handle ho jayein.

.catch((error) => next(error))
Agar requestHandler mein koi bhi error aaye, wo .catch() ke zariye pakar liya jata hai aur next(error) ke zariye Express ke error middleware ko de diya jata hai.

🎯 Faida (Fawaid)
Nuqta	Tashreeh
✅ Har route mein try/catch ki zarurat nahi	
✅ Code saf aur readable hota hai	
✅ Async function ke errors server crash nahi karte	
✅ Error automatically global handler tak chala jata hai	

🔁 Real-World Misal:
js
Copy
Edit
router.get('/user/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
}));
Yahan agar user nahi mila ya DB down ho gaya, to error next() ke zariye global error middleware ko chala jata hai.

🧯 Global Error Middleware:
js
Copy
Edit
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});
Ye function saare errors ko handle karta hai, jo asyncHandler ke zariye next(error) ke through aate hain.

📌 Mukhtasir Khulasa:
asyncHandler async route ko wrap karta hai.

Koi error ho to Express ke next() function ko call karta hai.

Aapko har route mein try/catch likhne ki zarurat nahi hoti.

Har async error global error middleware mein chala jata hai.

Backend APIs ke liye yeh aik best practice hai.

Agar aap chahte hain to mein asyncHandler ka istemal kar ke aik chhoti si Express.js app ka complete example bana sakta hoon. Batayein agar chahiye. */