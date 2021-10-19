
function isInt(number){
    try{
        parseInt(number);
        return true;
    }catch(err){
        return false;
    }
}

module.exports = {isInt};