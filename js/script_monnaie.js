function traiteErreurAPI(jqXHR, textStatus, errorThrown) {
  alert("Erreur " + errorThrown + " : " + textStatus+" API");
}
function traiteErreur(jqXHR, textStatus, errorThrown) {
  alert("Erreur " + errorThrown + " : " + textStatus);
}
var exchangeRates;

function getRates(callback){
  $.ajax({
      url: "https://api.exchangeratesapi.io/latest",
      dataType: "json",
      success: function (monaieJson) {
        //console.log(monaieJson);
        exchangeRates = monaieJson;
        callback();
        },
      error: traiteErreurAPI
  });
}

function parseMoney(money){
  return money.split(" ")[money.split(" ").length-1];
}

function convert(sum, devise1, devise2, exchangeRates){
  if(devise1=="EURO" && devise2=="EURO"){
    res =  sum;
  } else if(devise1=="EURO"){
    rate = exchangeRates["rates"][devise2];
    res =  sum * rate;
  } else if(devise2=="EURO"){
    rate = exchangeRates["rates"][devise1];
    res = sum/rate;
  } else{
    rate1 = exchangeRates["rates"][devise1];
    rate2 = exchangeRates["rates"][devise2];
    res = sum*(rate2/rate1);
  }
  return Math.floor(res*100)/100
}

function changePreference(monnaieJson){
  $.ajax({
    url : "/preferences",
    dataType:"json",
    type : "get",
    success: function(preferencesJson){
      if(monnaieJson.display==0){
      $("#devise-1").find("[value = "+preferencesJson["devise"]+"]").prop("selected",true);
    }
    },
    error: traiteErreur
  });
}

function changeText(){
$.ajax({
    url:"/monnaie",
    data:exchangeRates,
    dataType: "json",
    type:"get",
    success: function(monnaieJson){
      changePreference(monnaieJson);
      if(monnaieJson.display==0){
        $("#cache").hide();
      } else{
        $("#cache").show();
        if(monnaieJson["conversion"]["montant-1"]!=''){
          $("#montant-choisi").text(monnaieJson["conversion"]["montant-1"]);
        } else{
          $("#montant-choisi").text("0");
        }
        $("#devise-origine").text(parseMoney(monnaieJson["conversion"]["devise-1"]));
        $("#devise-arrivee").text(parseMoney(monnaieJson["conversion"]["devise-2"]));
        $("#devise-1").find("option").each(function(){
          $(this).prop("select",false);
        });
        $("#devise-1").find("[value = "+parseMoney(monnaieJson["conversion"]["devise-1"])+"]").prop("selected",true);
        $("#devise-2").find("option").each(function(){
          $(this).prop("select",false);
        });
        $("#devise-2").find("[value = "+parseMoney(monnaieJson["conversion"]["devise-2"])+"]").prop("selected",true);

        console.log(exchangeRates);
        new_sum = convert(parseInt(monnaieJson["conversion"]["montant-1"]), parseMoney(monnaieJson["conversion"]["devise-1"]),parseMoney(monnaieJson["conversion"]["devise-2"]), exchangeRates);
        console.log(new_sum);
        $("#montant-1").attr("value",monnaieJson["conversion"]["montant-1"]);
        $("#montant-2").attr("value",new_sum);

      }
    },
    error: traiteErreur
  });
}

function init(){
  getRates(changeText);
}
