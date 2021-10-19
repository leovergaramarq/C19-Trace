
function isInt(number){
    try{
        parseInt(number);
        return number !==NaN;
    }catch(err){
        return false;
    }
}

module.exports = {isInt};