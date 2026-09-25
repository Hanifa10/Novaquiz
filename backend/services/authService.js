const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const register = async (lastName, firstName, email, password) => {
    const userExist = await userModel.findOne({where: {email}});
    if (userExist) throw Error ("Cet utilisateur existe déjà");

    if (!lastName || !firstName || !email || !password) throw Error ("Veillez remplir tous les champs");

    if (password.length < 6) throw Error ("Votre mot de passe doit contenir au moins 6 caractères");

    const hashedPwd = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
        lastName,
        firstName,
        email,
        password: hashedPwd,
    }); 

    const token = await jwt.sign({id: newUser.id, email: newUser.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
    return { jwt: token, user: { id: newUser.id, email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName } };
}

const login = async (email, password) => {
    const user = await userModel.findOne({where: {email}});
    if (!user) throw Error ("Cet utilisateur n'existe pas");

    const isPwdMatch = await bcrypt.compare(password, user.password);
    if (!isPwdMatch) throw Error ("Mot de passe incorrect");
    
    const token = await jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
    return { jwt: token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } };
}

const logout = async () => {
    console.log('user déconnecté');
    return true;
}

module.exports = {
    register,
    login,
    logout
}