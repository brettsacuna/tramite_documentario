var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var api = require('./../config.json');

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", api.client);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());

var filename_aux;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);

        filename_aux = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
    }
});

var upload = multer({
                storage: storage
            }).single('file');

app.post('/upload', function(req, res) {
    upload(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }

        res.json({error_code:0,err_desc:null,filename:filename_aux});
    });
});

app.listen('9000', function(){
    console.log('Servidor de archivos ejecutándose en el puerto 3000');
});
