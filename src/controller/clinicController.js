import { json } from 'body-parser'
import clinicService from '../services/clinicService'

let createClinic = async (req, res) => {
  try {
    let data = await clinicService.createClinic(req.body)
    return res.status(200).json(data)
  } catch (error) {
    return res.status(200).json({
      errCode: 0,
      errorMessage: 'Error from server'
    })
  }
}
let getAllClinic = async (req, res) => {
  try {
    let data = await clinicService.getAllClinic()
    return res.status(200).json(data)
  } catch (error) {
    return res.status(200).json({
      errCode: 0,
      errorMessage: 'Error from server'
    })
  }
}
let getDetailClinicById = async (req, res) => {
  try {
    let data = await clinicService.getDetailClinicById(req.query.id)
    return res.status(200).json(data)
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errorMessage: 'Error from Server'
    })
  }
}
let deleteClinicById = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(200).json({
        errCode: 1,
        errorMessage: 'Missing parameterA'
      })
    } else {
      let data = await clinicService.deleteClinicById(req.body.id)
      return res.status(200).json({
        errCode: 0,
        errorMessage: 'Delete Success'
      })
    }
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errorMessage: 'error from server'
    })
  }
}
let getAllClinicById = async (req, res) => {
  try {
    let data = await clinicService.getAllClinicById(req.query.id)
    return res.status(200).json(data)
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errorMessage: 'Error from server'
    })
  }
}
let editClinicById = async (req, res) => {
  try {
    let data = await clinicService.editClinicById(req.body)
    return res.status(200).json(data)
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errorMessage: 'Error from Server'
    })
  }
}

module.exports = {
  createClinic: createClinic,
  getAllClinic: getAllClinic,
  getDetailClinicById: getDetailClinicById,
  deleteClinicById: deleteClinicById,
  getAllClinicById: getAllClinicById,
  editClinicById: editClinicById
}
