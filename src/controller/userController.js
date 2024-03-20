import { json } from 'body-parser'
import userService from '../services/userService'

let handlelogin = async (req, res) => {
  let email = req.body.email
  let password = req.body.password

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      errorMessage: 'Missing input Parameter !'
    })
  }
  let userData = await userService.handleUserlogin(email, password)

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errorMessage,
    user: userData.user ? userData.user : {}
  })
}

let handleGetAllUser = async (req, res) => {
  let id = req.query.id

  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errorMessage: 'Missing Parameter',
      users: []
    })
  }
  let users = await userService.getAllUsers(id)
  return res.status(200).json({
    errCode: 0,
    errorMessage: 'OK',
    users
  })
}
let handleCreateNewUser = async (req, res) => {
  let data = await userService.createNewUser(req.body)
  return res.status(200).json(data)
}
let handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return json.status(200).json({
      errCode: 1,
      errorMessage: 'Missing Parameter'
    })
  }
  let data = await userService.deleteUser(req.body.id)
  return res.status(200).json({
    errCode: 0,
    errorMessage: 'Delete Success'
  })
}
let handleEditUser = async (req, res) => {
  let data = await userService.updateUser(req.body)
  return res.status(200).json(data)
}
let getAllCode = async (req, res) => {
  try {
    let data = await userService.getAllcodeService(req.query.type)
    return res.status(200).json(data)
  } catch (error) {
    console('Get Allcode Error', e)
    return res.status(200).json({
      errCode: -1,
      errorMessage: 'error from server'
    })
  }
}
module.exports = {
  handlelogin: handlelogin,
  handleGetAllUser: handleGetAllUser,
  handleCreateNewUser: handleCreateNewUser,
  handleDeleteUser: handleDeleteUser,
  handleEditUser: handleEditUser,
  getAllCode: getAllCode
}
