const { compareAPIKey } = require('../functions/bcrypt.js');
const { checkAPikey } = require('../functions/database.js');
async function apikeyCheck(req, res, next) {
    //const authHeader = req.headers.authorization
    try{
        let apikey = req.headers.authorization
        if(!apikey){
            throw new Error('NotAuthed')
        }
        else{
            //compare apikey to db
            
        }
        next()
    }catch(error){
        next(error);
    }

}

module.exports = { apikeyCheck };

/*
1) take user supplied api key
2) hash and salt 
3) compare to stored hash and salt in db 
4) if match, check permissions
5) if permissions allow, continue
6) else throw error
*/
/*

I plan to seed some data in user and api
Than use the system info and my API middleware will somehow check the supplied API key and check
If it's correct API key and has canWrite perms
I allow it to access put and post


async function auth(req, res, next){
    try{
        let token = // get token
        
        req.token = token

        if(req.method === 'GET' && token.canRead){
          return next()
        }

        if(req.method === 'POST' && token.canWrite){
          return next()
        }

        throw new Error('NotAuthed')
                
    }catch(error){
        next(error);
    }
}



*/