import jsonwebtoken from "jsonwebtoken";

const middlewareController = {
    verifyToken : (req , res , next) =>{
        const token = req.headers.token;
        if(token){
            
            jsonwebtoken.verify(token , process.env.JWT_ACCESS_KEY, (err , user)=>{
                if(err){
                    res.status(403).json('token chưa chính xác')
                }
                req.user = user
                next()
            })
        }else{
            res.status(401).json('Bạn chưa đăng nhập')
        }
    },

    verifyTokenAdmin : (req , res, next)=>{
        middlewareController.verifyToken(req, res , ()=>{
            if(req.user.admin){
                next()
            }else{
                res.status(403).json('Chưa có quyền admin')
            }
        })
    },

    verifyTokenmy : (req , res , next) =>{
        middlewareController.verifyToken(req, res , ()=>{
            if(req.user.id == req.params.id){
                next();
            }else{
                res.status(403).json('Đây không phải bạn')
            }
        })
    }
}

export default middlewareController