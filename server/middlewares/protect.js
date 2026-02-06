const jwt = require("jsonwebtoken")
const protect = (req, res, next) => {
    // 1. check for cookie
    const  ADMIN  = req.cookies.ADMIN

    // 2. if not available send error
    if (!ADMIN){
        return res.status(401).json({message: "no cookie found", success: false })
    }

    // 3. check for token

    // 4. if not available send error
    //                                      👇🏻 from auth.controller login function payload of jwt.sign
    jwt.verify(ADMIN, process.env.JWT_KEY, (_, decode) => { 
        console.log(decode);
        
        if(!decode){
            return res.status(401).json({message: "invalid token", success: false})
        }

        next()
    })

    // 5. if everything avalable call next()
}

module.exports = protect