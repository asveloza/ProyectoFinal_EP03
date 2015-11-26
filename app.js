"use strict";
var express 	= 	require("express"),
	app			= 	express(),
	cons 		=	require("consolidate"),
	puerto 		= 	process.env.PORT || 8082,
	db   		= 	require('./modulos/database'),
	bodyParser  =   require('body-parser');

	db.conectaDatabase();

	//consolidate integra swig con express...
	app.engine("html", cons.swig); //Template engine...
	app.set("view engine", "html");
	app.set("views", __dirname + "/vistas");
	app.use(express.static('public'));


//Para indicar que se envía y recibe información por medio de Json...
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res)
{
	res.render("index", {
		titulo 	:  	"Trivia"
	});
});

app.get('/getQuestions', function(req, res){
		db.queryMysql("select numpregunta, pregunta, opcion1, opcion2, opcion3, opcion4 from pregunta order by rand();", function(err, data){
			if (err) throw err;
			res.json(data);
		});
	});

app.post('/isValid', function(req, res){
		db.queryMysql("SELECT solucion AS respuestaCorrecta, ( solucion =" + req.body.respuesta + ") AS correcto FROM pregunta WHERE numpregunta = " + req.body.numPregunta +";", function(err, data){
			if (err) throw err;
			res.json(data);
		});
	});


//app.post('/isValid', rutas.isValid);



	//Iniciar el Servidor...
	var server = app.listen(puerto, function(err) {
	   if(err) throw err;
	   var message = 'Servidor corriendo en @ http://localhost:' + server.address().port;
	   console.log(message);
	});