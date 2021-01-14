const Datauri = require('datauri');
const path = require('path');

const cloudinary = require('../config/cloudinary');
const sgMail = require('@sendgrid/mail');
const _ = require('lodash');

sgMail.setApiKey(process.env.SEND_GRID_KEY);

exports.uploader = (req) => {
    return new Promise((resolve, reject) => {
        const dUri = new Datauri();
        let image = dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

        cloudinary.uploader.upload(image.content, (err, url) => {
            if (err) return reject(err);
            return resolve(url);
        })
    });
}

exports.sendEmail = (mailOptions) => {
    return new Promise((resolve, reject) => {
        sgMail.send(mailOptions, (error, result) => {
            if (error) return reject(error);
            return resolve(result);
        });
    });
}

exports.throw400Error = (req, res, message,code) => {
    return res.status(400).json({ message, errorCode: code ? code : -1 });
}

const timeToSecondsInNumber = (string) => {
    var mins, secs;
    [mins, secs] = string.split(":").slice(-2).map(n => parseInt(n, 10));
    return mins * 60 + secs;
}

const formatDuration = (duration, showLabel) => {
    function pad(number) {
        return `${number}`.slice(-2);
    }

    let hours = duration / 3600 | 0;
    let minutes = duration % 3600 / 60 | 0;
    let seconds = duration % 60;
    if (showLabel) {
        let minsSecs = `${pad(minutes)}min:${pad(seconds)}sec`;
        return hours > 0 ? `${hours}hr:${minsSecs}` : minsSecs;
    }
    let minsSecs = `${pad(minutes)}:${pad(seconds)}`;
    return hours > 0 ? `${hours}:${minsSecs}` : minsSecs;
    

    
}

const transformUnit = async (units, user) => {
    if (!units || !units.length) {
        return Promise.resolve(units);
    }
    units.sort((a, b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0));
    const promises = units.map(unit => {
        let modifiedUnit = {};
        modifiedUnit.title = unit.title;
        modifiedUnit._id = unit._id;
        modifiedUnit.utype = unit.utype;
        modifiedUnit.eminf = unit.emin;
        modifiedUnit.emin = timeToSecondsInNumber(unit.emin);
        modifiedUnit.emins = formatDuration(modifiedUnit.emin,true);
        modifiedUnit.lock = true;
        if (user.learningPath.currentUnit &&
            user.learningPath.currentUnit._id &&
            user.learningPath.currentUnit._id.toString() == unit._id.toString()) {
            modifiedUnit.current = true;
            modifiedUnit.usource = unit.usource;
            modifiedUnit.lock = false;
            if (modifiedUnit.utype == "q" &&
                (modifiedUnit.usource && modifiedUnit.usource.quizLists && modifiedUnit.usource.quizLists.length)) {
                modifiedUnit.usource.totPoint = modifiedUnit.usource.quizLists.reduce((accum, quiz) => accum + quiz.point, 0);
            }
        }
        if (user.learningPath && user.learningPath.historyUnits && user.learningPath.historyUnits.length) {
            const historyUnit = user.learningPath.historyUnits.find(hunit => hunit._id.toString() === unit._id.toString());
            if (historyUnit) {
                modifiedUnit.lock = false;
                modifiedUnit.usource = unit.usource;
                if (modifiedUnit.utype == "q" &&
                    (modifiedUnit.usource && modifiedUnit.usource.quizLists && modifiedUnit.usource.quizLists.length)) {
                        let totPoint = 0;
                        modifiedUnit.usource.quizLists = modifiedUnit.usource.quizLists.map( quiz => {
                            totPoint += quiz.point ? quiz.point : 0;
                            return _.omit(quiz, ['valid_answer']);
                        })
                        modifiedUnit.usource.totPoint = totPoint;
                }
            }
        }
        return modifiedUnit;
    })
    return await Promise.all(promises);
}

// Just for Referent if we call async call in between map
exports.transformModule = async (course, user) => {
    if (course && course.cmodules && course.cmodules.length) {
        course.cmodules.sort((a, b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0));
        const promises = course.cmodules.map(async cmodule => {
            let modifiedModule = {};
            cmodule.topics.sort((a, b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0));
            const promises_topics = cmodule.topics.map(async topic => {
                let modifiedTopic = {};
                modifiedTopic.title = topic.title;
                modifiedTopic.units = await transformUnit(topic.units, user);
                modifiedTopic._id = topic._id;
                modifiedTopic.emin = topic.units.reduce((sum, unit) => {
                    let string = unit.emin;
                    var mins, secs;
                    [mins, secs] = string.split(":").slice(-2).map(n => parseInt(n, 10));
                    return sum + mins * 60 + secs;
                }, 0)
                modifiedTopic.eminf = formatDuration(modifiedTopic.emin);
                modifiedTopic.emins = formatDuration(modifiedTopic.emin,true);
                return modifiedTopic;
            })
            modifiedModule.topics = await Promise.all(promises_topics);
            modifiedModule.emin = modifiedModule.topics.reduce((accum, topic) => accum + topic.emin, 0);
            modifiedModule.eminf = formatDuration(modifiedModule.emin);
            modifiedModule.emins = formatDuration(modifiedModule.emin,true);
            return modifiedModule;
        })
        return await Promise.all(promises);
    } else {
        return course;
    }
}

exports.ifArraysEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    let a_copy = [...a];
    let b_copy = [...b];
    a_copy = a_copy.sort();
    b_copy = b_copy.sort();

    for (var i = 0; i < a_copy.length; ++i) {
        if (a_copy[i] !== b_copy[i]) return false;
    }
    return true;
}
exports.transformUnit = transformUnit;
exports.formatDuration = formatDuration;
exports.timeToSecondsInNumber = timeToSecondsInNumber;


