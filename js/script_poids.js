function traiteErreur(jqXHR, textStatus, errorThrown) {
  alert("Erreur " + errorThrown + " : " + textStatus);
}

var facteursConversionPoids = {
  //valeur dans l'unite_courante*facteur=equivalent en g
  'g' : 1,
  'kg' : 1000,
  'ounce (UK)' : 28.349,
  'pound' : 453.59
}

var listUniteDisp = ["g","kg","oz","Lb"];
var listUnite = ["g","kg", "ounce (UK)","pound"]

function convertPoids(uniteEntree,uniteSortie,entree){
  var res = entree*facteursConversionPoids[uniteEntree]/facteursConversionPoids[uniteSortie];

  return Math.round(res*1000)/1000;
}

function changePreference(){
  $.ajax({
    url : "/preferences",
    dataType:"json",
    type : "get",
    success: function(preferencesJson){
      $("#uniteEntree").find("[value = "+preferencesJson["poids"]+"]").prop("selected",true);
    },
    error: traiteErreur
  });
}

function changeTextPoids(){
  changePreference();
  $.get("/poids", function (jsondoc) {

    if (jsondoc.display == 1) {
      console.log(jsondoc);
      $("#resultatPoids").show();

      $("[name=entree]").val(jsondoc.conversion.entree);
      $("#affichageEntreePoids").text(jsondoc.conversion.entree);

      $("[name=uniteEntree]").val(jsondoc.conversion.uniteEntree);
      $("#affichageUniteEntreePoids").text(listUniteDisp[parseInt(jsondoc.conversion.uniteEntree)]);

      $("[name=uniteSortie]").val(jsondoc.conversion.uniteSortie);
      $("#affichageUniteSortiePoids").text(listUniteDisp[parseInt(jsondoc.conversion.uniteSortie)]);
     

      resultat=convertPoids(listUnite[parseInt(jsondoc.conversion.uniteEntree)],listUnite[parseInt(jsondoc.conversion.uniteSortie)],jsondoc.conversion.entree);
      console.log(resultat);
      $("#affichageResultatPoids").attr("value",resultat);
    }
    else {
      $("#resultatPoids").hide();
    };  

        
  },"json");
}