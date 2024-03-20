import _ from 'lodash'
import db from '../models/index'
import emailService from './emailService'
require('dotenv').config()
import { v4 as uuidv4 } from 'uuid'

let checkRequireField = (inputData) => {
  let arrFields = [
    'doctorId',
    'contentHTML',
    'contentMarkdown',
    'action',
    'selectedPrice',
    'selectedProvince',
    'selectedPayment',
    'nameClinic',
    'addressClinic',
    'specialtyId'
  ]
  let isValid = true
  let element = ''
  for (let i = 0; i < arrFields.length; i++) {
    if (!inputData[arrFields[i]]) {
      isValid = false
      element = arrFields[i]
      break
    }
  }
  return { element: element, isValid: isValid }
}
let buildUrlEmail = (doctorId, token) => {
  let result = `${process.env.REACT_ENV}/verify-booking?token=${token}&doctorId=${doctorId}`
  return result
}
let buildUrlEmailParkage = (parkageId, token) => {
  let result = `${process.env.REACT_ENV}/verify-booking-parkage?token=${token}&parkageId=${parkageId}`
  return result
}
let postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.timeType ||
        !data.date ||
        !data.fullName ||
        !data.timeString ||
        !data.phoneNumber ||
        !data.address ||
        !data.selectedGender
      ) {
        resolve({
          errCode: 1,
          errorMessage: 'Missing Parameter'
        })
      } else {
        let doctor = await db.User.findOne({
          where: { id: data.doctorId, roleid: 'R2' },
          attributes: ['firstName', 'lastName']
        })
        let doctorName = `${doctor.firstName} ${doctor.lastName}`

        let token = uuidv4()
        await emailService.sendEmailBooking({
          email: data.email,
          time: data.timeString,
          patientName: data.fullName,
          doctorName: doctorName,
          language: data.language,
          redirectlink: buildUrlEmail(data.doctorId, token)
        })

        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleid: 'R3',
            gender: data.selectedGender,
            address: data.address,
            firstName: data.fullName,
            phonenumber: data.phoneNumber
          }
        })
        if (user && user[0]) {
          await db.Booking.findOrCreate({
            // where: { patienId: user[0].id },
            where: { patienId: user[0].id, statusId: ['S1', 'S2'] },
            defaults: {
              statusId: 'S1',
              doctorId: data.doctorId,
              patienId: user[0].id,
              date: data.date,
              timeType: data.timeType,
              reason: data.reason,
              token: token
            }
          })
        }
        resolve({
          errCode: 0,
          errorMessage: 'Save Patient Success'
        })
      }
    } catch (error) {
      reject(error)
    }
  })
}
let verifyBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          errCode: 1,
          errorMessage: 'Missing Parameter'
        })
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: 'S1'
          }
        })
        if (appointment) {
          await db.Booking.update(
            { statusId: 'S2' },
            {
              where: {
                doctorId: data.doctorId,
                token: data.token,
                statusId: 'S1'
              }
            }
          )
          resolve({
            errCode: 0,
            errorMessage: 'Update to S2 Success !'
          })
        } else {
          resolve({
            errCode: 2,
            errorMessage: 'Appointment has been activated or not exist'
          })
        }
      }
    } catch (error) {
      reject(error)
    }
  })
}
let postBookAppointmentParkage = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.parkageId ||
        !data.timeType ||
        !data.date ||
        !data.fullName ||
        !data.phoneNumber ||
        !data.address ||
        !data.selectedGender
      ) {
        resolve({
          errCode: 1,
          errorMessage: 'Missing Parameter'
        })
      } else {
        let token = uuidv4()
        await emailService.sendEmailBooking({
          email: data.email,
          time: data.timeString,
          patientName: data.fullName,
          doctorName: data.name,
          language: data.language,
          redirectlink: buildUrlEmailParkage(data.parkageId, token)
        })
        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleid: 'R3',
            gender: data.selectedGender,
            address: data.address,
            firstName: data.fullName,
            phonenumber: data.phoneNumber
          }
        })
        if (user && user[0]) {
          await db.Booking.findOrCreate({
            // where: { patienId: user[0].id },
            where: { patienId: user[0].id, statusId: ['S1', 'S2'] },
            defaults: {
              statusId: 'S1',
              parkageId: data.parkageId,
              patienId: user[0].id,
              date: data.date,
              timeType: data.timeType,
              reason: data.reason,
              token: token
            }
          })
        }
        resolve({
          errCode: 0,
          errorMessage: 'Save Patient Success'
        })
      }
    } catch (error) {
      reject(error)
    }
  })
}
let verifyBookAppointmentParkage = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.parkageId) {
        resolve({
          errCode: 1,
          errorMessage: 'Missing Parameter'
        })
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            parkageId: data.parkageId,
            token: data.token,
            statusId: 'S1'
          }
        })
        if (appointment) {
          await db.Booking.update(
            { statusId: 'S2' },
            {
              where: {
                parkageId: data.parkageId,
                token: data.token,
                statusId: 'S1'
              }
            }
          )
          resolve({
            errCode: 0,
            errorMessage: 'Update to S2 Success !'
          })
        } else {
          resolve({
            errCode: 2,
            errorMessage: 'Appointment has been activated or not exist'
          })
        }
      }
    } catch (error) {
      reject(error)
    }
  })
}
module.exports = {
  postBookAppointment: postBookAppointment,
  verifyBookAppointment: verifyBookAppointment,
  postBookAppointmentParkage: postBookAppointmentParkage,
  verifyBookAppointmentParkage: verifyBookAppointmentParkage
}
