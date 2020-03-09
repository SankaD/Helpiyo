const nodemailer = require('nodemailer');
const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');
const logger = require('./logger');

module.exports = (from, email, templateId, templateData) => {
    return sgMail.send({
        to: email,
        from: from,
        templateId: templateId,//"d-0e189ad8620a45928cbbd0f327a32f9c",
        dynamic_template_data: templateData
    })
        .catch(error => {
            logger.info(templateId);
            logger.info(templateData);
            logger.error("sending email failed");
            logger.error(error);
        });
};
