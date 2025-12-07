import jwt from 'jsonwebtoken';

const tokenChecker = function(req, res, next){
    var authHeader = req.headers['authorization'];

    if(!authHeader){
        return res.status(401).send({
            success:false,
            message: 'Nessun token trovato'
        });
    }
    //usiamo il formato token bearer, scritto così : Bearer ${token} quindi splitto la stringa, vedo se è lunga almeno 2 e poi tento il verify sul secondo elemento
    //Così rispettiamo standard di sicurezza e convenzioni per aggiungere eventuali librerie
    const splitted = authHeader.split(' ');

    if (splitted.length !== 2 || splitted[0] !== 'Bearer') {
        return res.status(400).send({
            success: false,
            message: 'Formato header Authorization non valido'
        });
    }
    var token = splitted[1];

    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
        if(err){
            return res.status(401).send({
                success:false,
                message: 'Credenziali errate'
            });
        }
        else{
            req.loggedUser = decoded;//nome standard del campo dove salvare i dati utente
            next();
        }
    })
}
export default tokenChecker;