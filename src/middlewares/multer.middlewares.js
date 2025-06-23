import multer from "multer"


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./public/temp")
    },
    filename: function(req, file, cb)
    {
        cb(null, file.originalname)
    }
})

export const upload =  multer({
    storage,
})


/*🔍 Step-by-Step Explanation of Your Code
js
Copy
Edit
import multer from "multer";
(Ye line): Multer ko import kar rahe hain jo file uploads ko handle karta hai in Express apps.

js
Copy
Edit
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./public/temp")
    },
    filename: function(req, file, cb)
    {
        cb(null, file.originalname)
    }
});
⚙️ 1. multer.diskStorage({ ... })
(Ye method) ek configuration return karta hai jisme aap batate ho:

File kahan save hogi (destination)

File ka naam kya hoga (filename)

🗂️ destination: function (req, file, cb)
req: request object, agar aapko user ki info chahiye toh use kar sakte ho

file: Multer automatically file object pass karta hai (isme file ka naam, type, size etc hota hai)

cb (callback): callback function hai jisko call karna zaroori hota hai. Isme pehla parameter error hota hai (agar null diya toh koi error nahi), dusra parameter destination path.

📌 Real use:

js
Copy
Edit
cb(null, "./public/temp");
Ye keh raha hai "koi error nahi (null) aur file ./public/temp folder mein save karo".

🧾 filename: function (req, file, cb)
Ye function batata hai ki file ka naam kya ho jab wo server par save ho.

Yahan aap file.originalname use kar rahe ho — matlab frontend se aaya hua actual naam use ho raha hai.

📌 Real use:

js
Copy
Edit
cb(null, file.originalname);
Means "koi error nahi, file ka naam usi ka rakho jo frontend se aaya hai".

⚠️ Warning: file.originalname use karna risky ho sakta hai kyunki files overwrite ho sakti hain. Production me usually aise use karte hain:

js
Copy
Edit
cb(null, Date.now() + '-' + file.originalname);
📦 Final Upload Config:
js
Copy
Edit
export const upload =  multer({
    storage,
});
Ye upload variable banata hai jo multer middleware ko export karta hai with custom storage.

✅ How to Use It in Route
js
Copy
Edit
app.post('/upload', upload.single('myfile'), (req, res) => {
  res.send("File uploaded");
});
upload.single('myfile'): Sirf ek file upload karega jiska field name myfile hai.

File ka data aapko milta hai req.file mein.

📁 What is file, null, and cb?
file:
Ye object hota hai jisme uploaded file ki details hoti hain:

js
Copy
Edit
{
  fieldname: 'myfile',
  originalname: 'pic.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: './public/temp',
  filename: 'pic.jpg',
  path: 'public/temp/pic.jpg',
  size: 12345
}
null:
Callback function ka pehla argument error hota hai. Agar koi error nahi hai toh null pass karte hain.

cb:
Callback function — aap Multer ko batate ho "kaunsi jagah save karna hai", ya "file ka kya naam rakhna hai".

📌 More Real-Time Used Multer Methods
1. upload.array('photos', 5)
Upload up to 5 files with same field name:

js
Copy
Edit
app.post('/gallery', upload.array('photos', 5), (req, res) => {
  console.log(req.files); // array of files
});
2. upload.fields([{ name: 'avatar' }, { name: 'resume' }])
Different field names for multiple files:

js
Copy
Edit
app.post('/profile', upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), (req, res) => {
  console.log(req.files.avatar);
  console.log(req.files.resume);
});
3. upload.none()
Accept only form fields, no files (useful for forms where file upload is optional but content type is multipart/form-data):

js
Copy
Edit
app.post('/submit', upload.none(), (req, res) => {
  console.log(req.body);
});
💡 Real Time Projects Where Multer is Used
Use Case	Explanation
✅ User profile picture upload	Store photo in /public/profile_pics
✅ Product images upload	Multiple image files for each product
✅ Resume file upload	Store .pdf or .docx files
✅ Cloud upload	Use memory storage and upload to AWS S3

Would you like me to:

Integrate this into a full Express route?

Show how to validate file types (only images)?

Add MongoDB to store the file reference?

Let me know and I’ll give a complete example.








 */