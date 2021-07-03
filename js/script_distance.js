var facteursConversionDistance = {
  //valeur dans l'unite_courante*facteur=equivalent en m
  'm' : 1,
  'km' : 1000,
  'mile' : 1609.34,
  'mille marin' : 1852
}

var listUniteDisp = ["m","km","mi","NM"];
var listUnite = ["m","km","mile","mille marin"];

function traiteErreur(jqXHR, textStatus, errorThrown) {
  alert("Erreur " + errorThrown + " : " + textStatus);
}


function convertDistance(uniteEntree,uniteSortie,entree){
  console.log(uniteEntree);
  console.log(entree);
  console.log(facteursConversionDistance[uniteEntree]);
  console.log(facteursConversionDistance[uniteSortie]);
  var res = entree*facteursConversionDistance[uniteEntree]/facteursConversionDistance[uniteSortie];
  console.log(res);
  return Math.round(res*1000)/1000;
}

function changePreference(){
  $.ajax({
    url : "/preferences",
    dataType:"json",
    type : "get",
    success: function(preferencesJson){
      $("#uniteEntree").find("[value = "+preferencesJson["distance"]+"]").prop("selected",true);
    },
    error: traiteErreur
  });
}

function changeTextDistance(){
  changePreference();
  $.get("/distance", function (jsondoc) {

    if (jsondoc.display == 1) {
      console.log(jsondoc);
      $("#resultatDistance").show();
      
      
      $("[name=entree]").val(jsondoc.conversion.entree);
      $("#affichageEntreeDistance").text(jsondoc.conversion.entree);

      $("[name=uniteEntree]").val(jsondoc.conversion.uniteEntree);
      $("#affichageUniteEntreeDistance").text(listUniteDisp[parseInt(jsondoc.conversion.uniteEntree)]);

      $("[name=uniteSortie]").val(jsondoc.conversion.uniteSortie);
      $("#affichageUniteSortieDistance").text(listUniteDisp[parseInt(jsondoc.conversion.uniteSortie)]);
     

      resultat=convertDistance(listUnite[parseInt(jsondoc.conversion.uniteEntree)],listUnite[parseInt(jsondoc.conversion.uniteSortie)],jsondoc.conversion.entree);
      console.log(resultat);
      $("#affichageResultatDistance").attr("value",resultat);
    }
    else {
      $("#resultatDistance").hide();
    };  

        
  },"json");
}


