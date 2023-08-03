var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
var popup = require('node-popup');
var connection = mysql.createConnection({
                host: '34.171.87.119',
                user: 'root',
                password: 'test1234',
                database: 'olympicsdata'
});

connection.connect;


var app = express();

// set up ejs view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));

/* GET home page, respond by rendering index.ejs */
app.get('/', function(req, res) {res.render('index', {title: 'Tokyo Olympics 2020 Data'}); });

app.get('/success', function(req, res) {res.send({'message': 'Did a thing'}); });

/*
Functions to implement ased on HTML page:
***NOTE: Only one of each of the following is required: Insert, Delete, Modify/Update, Search.***
Note: For any people's names, the lastName and firstName will need to be concatinated as lastName, firstName
Athletes:
	'addAthlete': Given a firstName, lastName, country, and discipline, insert into the database. If the entry already
		exists, then the entry should be updated.
	'removeAthlete': Given a firstName & lastName, delete the athlete from the database.

Coaches: Exactly the same as Athletes but with coaches. 'addCoach' and 'removeCoach', respectively.

Teams:
	'addTeam': Given a teamName, discipline, country, and event, insert into the database. If the entry already
		exists, update it.
	'removeTeam: Given a teamName, remove the team from the database.

Medals:
	'awardMedal': Given a country and a radio button selection, increment the correct country's medal count.
		If the country has yet to win a medal, an insert may be required.
	'stripMedal': Givena  country and a radio button selection, decrement the correct country's medal count.
		If the country loses it's last medal, a delete may be required.

Team/Individual Participants
	'addGender': Given a discipline and a radio button selection, increment the discipline's men/women count.
		If the discipline has yet to have teams, an insert may be required.
	'removeGender': Given a discipline and a radio button selection, decrement the discipline's men/women count.
		If the discipline is left with no more teams, a delete may be required.

Searches: Basicallyy any filled entries go into the "where" clause and any empty entries are considered "get all"
	'findAthlete': Can take a firstName, lastName, country, and/or discipline.
	'findCoach': Can take a firstName, lastName, country, and/or discipline.
	'teamsInSport': Given a discipline, return all the countries participating in that discipline.
	'countryInSports': Given a country, return all thee disciplines the country is participating in.
	'medalCount': Given a country, return the medal count of that country.

Complex Functions: (I am not sure what advanced functions are needed, but the HTML doesn't acount for them right now. Please update as needed)
*/



//Code runs when Submit is hit
app.post('/addAthlete', function(req, res) {
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var country = req.body.country;
	var discipline = req.body.discipline;
	console.log(firstName, lastName, country, discipline);

	var name = lastName + ' ' + firstName;

	var sql = `INSERT INTO athletes (Name, NOC, Discipline) VALUES ('${name}', '${country}', '${discipline}')`;
	//var sql = `INSERT INTO athletes (Name, NOC, Discipline) VALUES ('SMITH Bob', 'United States of America', 'Basketball')`;
	console.log(sql);

	connection.query(sql, function(err, res) {
		if (err) {
			throw(err);
		}
		//res.send('success');
	});

	res.send('success');
 });
app.post('/removeAthlete', function(req, res) {
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var name = lastName + ' ' + firstName;

	var sql = `DELETE FROM athletes WHERE Name='${name}'`;
	// var sql = `DELETE FROM athletes WHERE Name='SMITH Bob'`;
	console.log(sql);

	connection.query(sql, function(err, res) {
		if(err){
			throw(err);
		}
		//res.send('success');
	});
	res.send('success');
});

app.post('/addCoach', function(req, res) {
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var name = lastName + ' ' + firstName;
	var country = req.body.country;
	var discipline = req.body.discipline;

	var sql = `UPDATE coaches SET Discipline='${discipline}' WHERE Name='${name}'`;
	//var sql = `UPDATE coaches SET Discipline='Basketball' WHERE Name='ABE Junya'`;
	console.log(sql);

	connection.query(sql, function(err, res){
		if (err) {
			throw(err);
		}
	});

	res.send('success');
});

app.post('/teamsInSport', function(req, res) {
	var discipline = req.body.discipline;
	
	var sql = `SELECT NOC, Event FROM teams WHERE Discipline='${discipline}'`;
	// var sql = `SELECT NOC FROM teams WHERE Discipline='Basketball'`;
	console.log(sql);
	
	temp = connection.query(sql, function(err, rows) {
		if (err) {
			throw(err);
		}
		// setRows(rows);
		// res.send(rows);
		res.render('teamsTable', {title: 'Teams in Sport', data:rows});
	});
});

app.post('/countryInSports', function(req, res) {
	var country = req.body.country;
	
	var sql = `SELECT Discipline, Event FROM teams WHERE NOC='${country}'`;
	console.log(sql);
	
	temp = connection.query(sql, function(err, rows) {
		if (err) {
			throw(err);
		}
		// setRows(rows);
		// res.send(rows);
		console.log(rows);
		res.render('countriesTable', {title: 'Countries in Sport', data:rows});
	});
});
app.post('/findAthlete', function(req, res){
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var country = req.body.country;
	var discipline = req.body.discipline;

	var name = lastName + ' ' + firstName;
	var sql = `SELECT * FROM athletes WHERE Name='${name}'`;
	console.log(sql);
	temp = connection.query(sql, function(err, rows){
		if(err){
			throw(err);
		}
		console.log(rows);
		res.render('findAthleteTable', {title: 'Search Results', data:rows});
	});
});

app.post('/findCoach', function(req, res){
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var country = req.body.country;
	var discipline = req.body.discipline;

	var name = lastName + ' ' + firstName;
	var sql = `SELECT * FROM coaches WHERE NOC='${country}'`;
	console.log(sql);
	temp = connection.query(sql, function(err, rows){
		if(err){
			throw(err);
		}
		console.log(rows);
		res.render('findCoachTable', {title: 'Search Results', data:rows});
	});
});
app.post('/medalsCountry', function(req, res){
	var country = req.body.country;
	var sql = `SELECT * FROM medals WHERE NOC='${country}'`;
	temp = connection.query(sql, function(err, rows){
		if(err){
			throw(err);
		}
		console.log(rows);
		res.render('medalsTable', {title: 'Search Results', data:rows});
	})
})

app.get('/advancedQuery1', function(req,res) {
	var sql = 'select athletes.NOC, Count(athletes.NOC) as number from athletes join coaches on athletes.NOC = coaches.NOC and athletes.Discipline = coaches.Discipline group by athletes.NOC order by Count(athletes.NOC) desc limit 15';
	console.log(sql);
	temp = connection.query(sql, function(err, rows) {
		if (err) {
			throw(err);
		}
		console.log(rows);
		res.render('advq1', {title:'Advanced Query', data:rows})	
	});
});
app.get('/advancedQuery2', function(req,res) {
	var sql = 'select * from medals m where m.Gold >= all(select m.Gold from medals m) union select * from medals m2 where m2.Silver >= all(select m2.Silver from medals m2)';
	console.log(sql);
	temp = connection.query(sql, function(err, rows) {
		if (err) {
			throw(err);
		}
		console.log(rows);
		res.render('advq2', {title: 'Advanced Query', data:rows})
	});
});
app.post('/aboveAverage', function(req, res) {
	var country = req.body.country;
	
	var sql = `CALL MedalsAboveAverage('${country}')`;
	console.log(sql);
	
	temp = connection.query(sql, function(err, rows) {
		if (err) {
			throw(err);
		}
		console.log(rows[0][0]);
		if(rows[0][0].above_avg == 1){
			res.send('They are above average');
		}else{
			res.send('They are not above average');
		}
	});
});

// console.log('Console Log');
// connection.query([SQL query], function(err, result) 
// {
//   if(err) {res.send(err) return;}
//   res.redirect('/success');
// } )


app.listen(80, function () {console.log('Node app is running on port 80'); });
