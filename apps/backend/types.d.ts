declare namespace Express{
    interface Request{
        userId?:string
    }
}

//overshadow the request in the middleware for teh clerk client