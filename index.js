

// VARIABLES

var express = require('express'); //import de la bibliothèque Express
var app = express(); //instanciation d'une application Express
var sqlite3 = require('sqlite3');
sqlite3.verbose();

var db = new sqlite3.Database(__dirname+ '/db/history.db3');


var historique;

db.all("select * from historique", function(err,rows) {
    historique = JSON.parse(rows[0].value);
    //console.log(historique);
    //console.log(historique);
});

var preferences = {
  "devise": "EURO",
  "poids" : 0,
  "distance" : 0,
  "cuisine" : {
    "ingredient" : 0,
    "unite" : 0
  }
}

var monnaie = {
  'display': 0,
  'conversion' : {
    'devise-1' : 'none',
    'devise-2' : 'none',
    'montant-1' : 'none'
  }
};

var cuisine = {
  'display': 0,
  'conversion' : {
    'uniteEntree' : 'none',
    'uniteSortie' : 'none',
    'entree' : 'none',
    'ingredient' : 'none'
  }
};

var poids = {
  'display': 0,
  'conversion' : {
    'uniteEntree' : 'none',
    'uniteSortie' : 'none',
    'entree' : 'none'
  }
};


var distance = {
  'display': 0,
  'conversion' : {
    'uniteEntree' : 'none',
    'uniteSortie' : 'none',
    'entree' : 'none'
  }
};


function convert(sum, devise1, devise2, exchangeRates){
  if(devise1=="EURO" && devise2=="EURO"){
    res =  sum;
  } else if(devise1=="EURO"){
    rate = exchangeRates[devise2];
    res =  sum * rate;
  } else if(devise2=="EURO"){
    rate = exchangeRates[devise1];
    res = sum/rate;
  } else{
    rate1 = exchangeRates[devise1];
    rate2 = exchangeRates[devise2];
    res = sum*(rate2/rate1);
  }
  return Math.floor(res*100)/100
}

function parseMoney(money){
  return money.split(" ")[money.split(" ").length-1];
}

var sum;
var devise1;
var devise2;
var tauxListe = {}

app.get('/setmonnaie',function(req,res){
  monnaie['display'] = 1;
  monnaie['conversion']["devise-1"] = req.query['devise-1'];
  monnaie['conversion']["montant-1"] = req.query['montant-1'];
  monnaie['conversion']["devise-2"] = req.query['devise-2'];
  date = new Date();
  sum = parseInt(req.query['montant-1']);
  devise1 = parseMoney(req.query['devise-1']);
  devise2 = parseMoney(req.query['devise-2']);
  res.redirect("/templates/monnaies.html");
});

app.get('/monnaie',function(req,res){
  rates = req.url.split("?")[1].split("&");
  for(i in rates){
    interm = rates[i].split("%");
    if(interm.length==3){
    tauxListe[interm[1].slice(2,5)] = parseFloat(interm[2].split("=")[1]);
    }
  }
  new_sum = convert(sum, devise1, devise2, tauxListe);
  date = new Date();
  //console.log(date.toLocaleString("en-US", {timeZone: "Europe/Paris"}));
  
  var date_str = date.toLocaleString("en-US", {timeZone: "Europe/Paris"}).split(" ");
  if(date_str[2]=="PM"){
    split = date_str[1].split(":");
    //console.log(split);
    hours = parseInt(split[0]);
    hours+=12;
    var time_str = [hours.toString(),split[1],split[2]].join(":");
  } else {
  var time_str = date_str[1];
  }
  //var time_str = date_str[1];
  historique[time_str]={
    'value-1': sum,
    'value-2': new_sum,
    'unit-1': devise1,
    'unit-2': devise2
  };
  //console.log(historique);

  if(false){
    historique = {'14:10:10': {
    'value-1': 10,
    'value-2': 10,
    'unit-1': 'EURO',
    'unit-2': 'EURO'
  }}
  }
  historique_db = JSON.stringify(historique);
  //console.log(historique_db);
  db.run('update historique set value =\''+historique_db+'\' where id = "default"');
  res.json(monnaie);
});

app.get('/historique',function(req,res){
  db.all("select * from historique", function(err,rows) {
    historique = JSON.parse(rows[0].value);
    //console.log(historique);
});
  res.json(historique);
} );

app.get('/preferences', function(req,res){
  res.json(preferences);
});

app.get('/setpreference',function(req,res){
  preferences["devise"] = req.query["select-devise"];
  preferences["poids"] = req.query["select-poids"];
  preferences["distance"] = req.query["select-distance"];
  preferences["cuisine"]["ingredient"] = req.query["select-ingredient"];
  preferences["cuisine"]["unite"] = req.query["select-unite"];
  console.log(preferences);
  res.redirect("/index.html");
});



app.get('/setCuisine',function(req,res){

  // ACTUALISE LES VALEURS DE LA VARIABLE CUISINE 
  cuisine.display = 1;
  cuisine.conversion.uniteEntree=req.query["uniteEntree"];
  cuisine.conversion.uniteSortie=req.query["uniteSortie"];
  cuisine.conversion.ingredient=req.query["ingredient"];
  cuisine.conversion.entree=req.query["entree"];
  res.redirect("/templates/cuisine.html#affichageResultat");
});

app.get('/cuisine',function(req,res){
  res.json(cuisine);
});


app.get('/setPoids',function(req,res){

  // ACTUALISE LES VALEURS DE LA VARIABLE POIDS 
  poids.display = 1;
  poids.conversion.uniteEntree=req.query["uniteEntree"];
  poids.conversion.uniteSortie=req.query["uniteSortie"];
  poids.conversion.entree=req.query["entree"];
  res.redirect("/templates/poids.html#affichageResultat");
});

app.get('/poids',function(req,res){
  res.json(poids);
});


app.get('/setDistance',function(req,res){

  // ACTUALISE LES VALEURS DE LA VARIABLE DISTANCE
  distance.display = 1;
  distance.conversion.uniteEntree=req.query["uniteEntree"];
  distance.conversion.uniteSortie=req.query["uniteSortie"];
  distance.conversion.entree=req.query["entree"];
  res.redirect("/templates/distances.html#affichageResultat");
});

app.get('/distance',function(req,res){
  res.json(distance);
});


app.get('/*', function(req, res) {
    //console.log(req.url);
    res.sendFile(__dirname + req.url);
});



// ACTIVATION

app.listen(8000); //commence à accepter les requêtes
console.log("App listening on port 8000...");