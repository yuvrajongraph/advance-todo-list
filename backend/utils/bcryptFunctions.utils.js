const bcrypt = require("bcrypt");

const  generateHashPassword = (password)=>{
    
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    return hash;

}

const compareHashPassword = (requestBodyPassword, userHashPassword)=>{
    const validPassword = bcrypt.compareSync(
        requestBodyPassword,
        userHashPassword
      );
      return validPassword;

}

module.exports={generateHashPassword, compareHashPassword}