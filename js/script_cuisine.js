
var densitesCuisine = { 
  //en g/cL 

  "Beurre" : 9.1,
  "Eau" : 10,
  "Farine" : 5.5,
  "Huile" : 9.2,
  "Lait" : 10.3,
  "Sucre" : 15.9

  };

var facteursConversion = {
  "mL" : 0.1,
  "cL" : 1,
  "tasse (US)" : 240,
  "tsp" : 0.492892,
  "tcp" : 1.47868
};

var listUnite =["mL","cL","g","tasse (US)", "tsp","tcp"];
var listUniteDisp =["mL","cL","g","c.", "tsp ","Tbs."];

var listIngredients = ["Beurre","Eau","Farine","Huile","Lait","Sucre"];

function convertCuisine(uniteEntree,uniteSortie,entree,ingredient){
  //volumeRef est le volume en cL

  if (uniteEntree === uniteSortie){
    var res = entree;
  }
  //cas poids > volume
  else if (uniteEntree === 'g'){
    var res = entree/(densitesCuisine[ingredient]*facteursConversion[uniteSortie]);
  }
  //cas volume > volume ou volume > poids
  else {
    var volumeRef = entree*facteursConversion[uniteEntree];
    if (uniteSortie === 'g'){
      var res = volumeRef*densitesCuisine[ingredient];
    }
    else {
      var res = volumeRef/facteursConversion[uniteSortie];
    }
  }

  return Math.round(res*100)/100;
}

function traiteErreur(jqXHR, textStatus, errorThrown) {
  alert("Erreur " + errorThrown + " : " + textStatus);
}

function changePreference(){
  $.ajax({
    url : "/preferences",
    dataType:"json",
    type : "get",
    success: function(preferencesJson){
      $("#ingredient").find("[value = "+preferencesJson["cuisine"]["ingredient"]+"]").prop("selected",true);
      $("#uniteEntree").find("[value = "+preferencesJson["cuisine"]["unite"]+"]").prop("selected",true);
    },
    error: traiteErreur
  });
}

function changeTextCuisine(){
  changePreference();
  $.get("/cuisine", function (jsondoc) {

    if (jsondoc.display == 1) {
      console.log(jsondoc);
      $("#resultatCuisine").show();

      $("[name=entree]").val(jsondoc.conversion.entree);
      $("#affichageEntree").text(jsondoc.conversion.entree);

      $("[name=uniteEntree]").val(jsondoc.conversion.uniteEntree);
      $("#affichageUniteEntree").text(listUniteDisp[parseInt(jsondoc.conversion.uniteEntree)]);

      $("[name=uniteSortie]").val(jsondoc.conversion.uniteSortie);
      $("#affichageUniteSortie").text(listUniteDisp[parseInt(jsondoc.conversion.uniteSortie)]);

      $("[name=ingredient]").val(jsondoc.conversion.ingredient);
      $("#affichageIngredient").text(listIngredients[parseInt(jsondoc.conversion.ingredient)]);
      $("#affichageIngredient-2").text(listIngredients[parseInt(jsondoc.conversion.ingredient)]);
      

      resultat=convertCuisine(listUnite[parseInt(jsondoc.conversion.uniteEntree)],listUnite[parseInt(jsondoc.conversion.uniteSortie)],jsondoc.conversion.entree,listIngredients[parseInt(jsondoc.conversion.ingredient)]);
      console.log(resultat);
      $("#affichageResultat").attr("value",resultat);
    }
    else {
      $("#resultatCuisine").hide();
    };  

        
  },"json");
}
