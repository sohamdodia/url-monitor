const Joi = require('joi');
const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})$/;

exports.createURL = Joi.object({
  url: Joi
        .string()
        .required()
        .regex(urlRegex, 'http://xyz.com')
        .options({
          language: {
            any: {
              empty: 'is required'
            }
          }
        })
        .label('URL'),
  method: Joi
            .any()
            .required()
            .valid(['get', 'post', 'put', 'delete'])
            .options({
              language: {
                any: {
                  empty: 'is required'
                }
              }
            })
            .label('Method'),
  headers: Joi
            .object()
            .label('Headers'),
  data: Joi
          .object()
          .label('Data')
});

exports.deleteURL = Joi.object({
  id: Joi
        .string()
        .required()
        .options({
          language: {
            any: {
              empty: 'is required'
            }
          }
        })
        .label('Id')
});

exports.updateURL = Joi.object({
  id: Joi
        .string()
        .required()
        .options({
          language: {
            any: {
              empty: 'is required'
            }
          }
        })
        .label('Id'),
  url: Joi
        .string()
        .regex(urlRegex, 'http://xyz.com')
        .label('URL'),
  method: Joi
            .string()
            .valid(['get', 'post', 'put', 'delete'])
            .label('Method'),
  headers: Joi
            .object()
            .label('Headers'),
  data: Joi
          .object()
          .label('Data')
})

exports.getURL = Joi.object({
  id: Joi
        .string()
        .required()
        .options({
          language: {
            any: {
              empty: 'is required'
            }
          }
        })
        .label('Id')
});