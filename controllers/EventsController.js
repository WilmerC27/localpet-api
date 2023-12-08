import Events from "../models/Events.js";
import { check, validationResult } from 'express-validator';
import path from 'path';

const getEvents = async (req, res) => {
    try {
        let events = '';
        events = await Events.findAll();
        return res.status(200).json({
            status: 200,
            events
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Lo sentimos, hubo un error'
        })
    }
}

const createEvents = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

const editEvents = async (req, res) => {
    try {
        
    } catch (error) {

    }
}

const deleteEvents = async (req, res) => {
    try {
        
    } catch (error) {

    }
}
export {getEvents, editEvents, createEvents, deleteEvents};