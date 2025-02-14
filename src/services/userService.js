import db from '../models/index'
import bcrypt from 'bcryptjs'

const salt = bcrypt.genSaltSync(10)

let handleUserlogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {}
      let isExist = await checkUserEmail(email)
      if (isExist) {
        let user = await db.User.findOne({
          where: { email: email },
          attributes: [
            'id',
            'email',
            'roleID',
            'password',
            'firstName',
            'lastName'
          ],
          raw: true
        })
        if (user) {
          let check = await bcrypt.compareSync(password, user.password)
          if (check) {
            userData.errCode = 0
            userData.errorMessage = 'OK'
            delete user.password
            userData.user = user
          } else {
            userData.errCode = 3
            userData.errorMessage = 'Wrong password'
          }
        } else {
          userData.errCode = 2
          userData.errorMessage = 'user not found'
        }
      } else {
        userData.errCode = 1
        userData.errorMessage = "Your email isn't Exist, Try again"
      }

      resolve(userData)
    } catch (err) {
      reject(err)
    }
  })
}
let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail }
      })
      if (user) {
        resolve(true)
      } else {
        resolve(false)
      }
    } catch (err) {
      reject(err)
    }
  })
}
let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    let users = ''
    try {
      if (userId === 'ALL') {
        users = await db.User.findAll({
          attributes: {
            exclude: ['password']
          }
        })
      }
      if (userId && userId !== 'ALL') {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ['password']
          }
        })
      }
      resolve(users)
    } catch (err) {
      reject(err)
    }
  })
}
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt)
      resolve(hashPassword)
    } catch (err) {
      reject(err)
    }
  })
}

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkUserEmail(data.email)
      if (check) {
        resolve({
          errCode: 1,
          errorMessage: 'your email is exist or inValid'
        })
      } else {
        let hashPassWordFromBcrypt = await hashUserPassword(data.password)
        await db.User.create({
          email: data.email,
          password: hashPassWordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phonenumber: data.phonenumber,
          gender: data.gender,
          roleid: data.roleid,
          positionId: data.positionId,
          image: data.avatar
        })
        resolve({
          errCode: 0,
          errorMessage: 'OK'
        })
      }
    } catch (err) {
      reject(err)
    }
  })
}
let deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: id }
      })
      if (!user) {
        resolve({
          errCode: 2,
          errorMessage: 'user does not exist'
        })
      }
      await db.User.destroy({
        where: { id: id }
      })
      resolve({
        errCode: 0,
        errorMessage: 'delete user success'
      })
    } catch (err) {
      reject(err)
    }
  })
}
let updateUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errorMessage: 'Missing Parameter'
        })
      }
      let user = db.User.findOne({
        where: { id: data.id }
      })
      if (user) {
        await db.User.update(
          {
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            roleid: data.roleid,
            positionId: data.positionId,
            gender: data.gender,
            phonenumber: data.phonenumber,
            image: data.avatar
          },
          {
            where: { id: data.id }
          }
        )
        resolve({
          errCode: 0,
          errorMessage: 'Edit User Success'
        })
      } else {
        resolve({
          errCode: 1,
          errorMessage: 'User not found'
        })
      }
    } catch (err) {
      reject(err)
    }
  })
}
let updateUser2 = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errorMessage: 'Missing Parameter'
        })
      }
      let user = db.User.findOne({
        where: { id: data.id }
      })
      if (user) {
        user.firstName = data.firstName
        user.lastName = data.lastName
        user.address = data.address
        await user.save()
        resolve({
          errCode: 0,
          message: 'Edit User Success'
        })
      } else {
        resolve({
          errCode: 1,
          errorMessage: 'User not found'
        })
      }
    } catch (err) {
      reject(err)
    }
  })
}
let getAllcodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          errorMessage: 'Missing require parameter'
        })
      } else {
        let res = {}
        let allcode = await db.Allcode.findAll({
          where: { type: typeInput }
        })
        res.errCode = 0
        res.data = allcode
        resolve(res)
      }
    } catch (error) {
      reject(error)
    }
  })
}
module.exports = {
  handleUserlogin: handleUserlogin,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  updateUser: updateUser,
  updateUser2: updateUser2,
  getAllcodeService: getAllcodeService
}
