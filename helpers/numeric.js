function isInt(number){
    try{
        number = parseInt(number);
        return !isNaN(number);
    }catch(err){
        return false;
    }
}

module.exports = {isInt};