import db from "../models/index";
import CRUDservice from "../services/CRUDservice";


let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('HomePage.ejs', { data: JSON.stringify(data) })
    }
    catch (err) { console.log(err); }

};
let getCRUD = async (req, res) => {
    return res.render("crud.ejs")
};

let POSTcrud = async (req, res) => {
    await CRUDservice.createNewUser(req.body);
    return res.redirect("/get-crud")

};
let displayGetCRUD = async (req, res) => {
    let data = await CRUDservice.getAllUser();
    return res.render('displayCRUD.ejs', {
        dataTable: data
    })
};
let getEditCRUD = async (req, res) => {
    let userId = req.query.id
    if (userId) {
        let userData = await CRUDservice.getUserInfoById(userId)
        return res.render('editCRUD.ejs', { userData: userData })
    }
    else {
        return res.send("User not found")
    }
};
let putCRUD = async (req, res) => {
    let data = req.body
    await CRUDservice.updateUserData(data)
    return res.redirect("/get-crud")
};
let deleteCRUD = async (req, res) => {
    let id = req.query.id
    if (id) {
        await CRUDservice.deleteUserById(id)
        return res.redirect("/get-crud")
    }
    else {
        return res.send("User not found")
    }

}


module.exports = {
    getHomePage: getHomePage,
    getCRUD: getCRUD,
    POSTcrud: POSTcrud,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}