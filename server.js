var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var	Sequelize = require('sequelize')

var app = express()

app.use(express.static(__dirname + '/app'))
app.use(cors())
app.use(bodyParser.json())

var	sequelize = new Sequelize('ParcAutoDB', 'root', '', { dialect : 'mysql', port : 3306}) 

var ParcAuto = sequelize.define('parcAuto', {
	denumire : {
		type : Sequelize.STRING,
		validate : {
			 len : [1,50]
		},
		
	},
	adresa : {
		type : Sequelize.STRING,
		validate : {
			 len : [5,50]
		},
		
	},
	capacitate : {
		type : Sequelize.INTEGER,
		validate : {
			 len : [1,30]
		},
		allowNull: false
	}
})

var Vehicul = sequelize.define('vehicul',{
	marca : {
		type : Sequelize.STRING,
		validate : {
			 len : [1,50]
		},
		allowNull: false
	},
	numar_inmatriculare : {
		type : Sequelize.STRING,
		validate : {
			len : [1, 50]
		},
		allowNull: false
	},
	culoare : {
		type : Sequelize.STRING,
		validate : {
			len : [1, 50]
		},
		allowNull: false
	}
})

ParcAuto.hasMany(Vehicul, {foreignKey : 'parcAutoId'})
Vehicul.belongsTo(ParcAuto, {foreignKey : 'parcAutoId'})

app.get('/create', function(req, res){
	sequelize
		.sync({ 
			force: true
		})
		.then(function(){
			res.status(201).send('created')
		})
		.catch(function(error){
			console.warn(error)
			res.status(500).send('not created')
		})
})

app.get('/parcAutoList', function(req, res) {
	ParcAuto
		.findAll({attributes : ['id','denumire','adresa','capacitate']})
		.then(function(parcAutoList){
			res.status(200).send(parcAutoList)
		})
		.catch(function(error){
			console.warn(error)
			res.status(500).send('not created')
		})
})

app.get('/parcAutoList/:id', function(req, res) {
	var id = req.params.id
	ParcAuto
		.find({where : {id : id},attributes : ['id','denumire','adresa','capacitate']})
		.then(function(parcAuto){
			res.status(200).send(parcAuto)
		})
		.catch(function(error){
			console.warn(error)
			res.status(500).send('not created')
		})
})

app.post('/parcAutoList',function(req,res){
	ParcAuto
		.create(req.body)
		.then(function(){
			res.status(201).send('created')
		})
		.catch(function(error){
			console.warn(error)
			res.status(500).send('not created')
		})
})

app.put('/parcAutoList/:id',function(req,res){
	var id = req.params.id
	ParcAuto
		.find({where : {id : id}})
		.then(function(parcAuto){
			return parcAuto.updateAttributes(req.body)
		})
		.then(function(){
			res.status(201).send('updated')
		})
		.catch(function(error){
			console.warn(error)
			res.status(500).send('not created')
		})
})

app.delete('/parcAutoList/:id',function(req,res){
	var id = req.params.id
	ParcAuto
		.find({where : {id : id}})
		.then(function(parcAuto){
			parcAuto.destroy()
		})
		.then(function(){
			res.status(201).send('updated')
		})
		.catch(function(error){
			console.warn(error)
			res.status(500).send('not created')
		})
})

app.get('/parcAutoList/:id/vehiculeList', function(req, res) {
	var id = req.params.id
	ParcAuto
		.find({where : {id : id}, include : [Vehicul]})
		.then(function(parcAuto){
			return parcAuto.getVehiculs()
		})
		.then(function(getVehiculs){
			console.warn(getVehiculs)
			res.status(200).send(getVehiculs)
		})
		.catch(function(error){
			console.warn(error)
			res.status(500).send('error')
		})
})

app.get('/vehiculeList/:search', function(req, res) {
	var search = req.params.search;
	console.warn(search);
	
	Vehicul
		.findAll({where : {marca : search}})
		.then(function(vehiculList){
			console.warn(vehiculList)
			res.status(200).send(vehiculList)
		})
		.catch(function(error){
			console.warn(error)
			res.status(500).send('error')
		})
})

app.post('/parcAutoList/:id/vehiculeList', function(req, res) {
	var id = req.params.id
	ParcAuto
		.find({where : {id : id}})
		.then(function(parcAuto){
			return Vehicul.create({
				marca : req.body.marca,
				numar_inmatriculare : req.body.numar_inmatriculare,
				culoare : req.body.culoare,
				parcAutoId : parcAuto.id
			})
		})
		.then(function(){
			res.status(201).send('created')
		})
		.catch(function(error){
			console.warn(error)
			res.status(500).send('error')
		})
})

app.put('/parcAutoList/:id/vehiculeList/:vId', function(req, res) {
	var vId = req.params.vId
	Vehicul
		.find({where : {id : vId}})
		.then(function(vehicul){
			vehicul.marca = req.body.marca
			vehicul.numar_inmatriculare = req.body.numar_inmatriculare
			vehicul.culoare = req.body.culoare
			return vehicul.save(['body','content'])
		})
		.then(function(){
			res.status(201).send('updated')
		})
		.catch(function(error){
			console.warn(error)
			res.status(500).send('not created')
		})
})

app.delete('/parcAutoList/:id/vehiculeList/:vId', function(req, res) {
	var vId = req.params.vId
	Vehicul
		.find({where : {id : vId}})
		.then(function(vehicul){
			vehicul.destroy()
		})
		.then(function(){
			res.status(201).send('deleted')
		})
		.catch(function(error){
			console.warn(error)
			res.status(500).send('not created')
		})
})

app.listen(8080)