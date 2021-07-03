function generateFlagURL(unit){
  code = codePays[unit];
  url = "https://www.countryflags.io/"+code+"/flat/64.png";
  return url;
}

var codePays = { 
  'EURO' : 'EU',
  'USD' : 'US',
  'JPY' : 'JP',
  'BGN' : 'BG',
  'CZK' : 'CZ',
  'DKK' : 'DK',
  'GBP' : 'GB',
  'HUF' : 'HU',
  'PLN' : 'PL',
  'RON' : 'RO',
  'SEK' : 'SE',
  'CHF' : 'CH',
  'ISK' : 'IS',
  'NOK' : 'NO',
  'HRK' : 'HR',
  'RUB' : 'RU',
  'TRY' : 'TR',
  'AUD' : 'AU',
  'BRL' : 'BR',
  'CAD' : 'CA',
  'CNY' : 'CN',
  'HKD' : 'HK',
  'IDR' : 'ID',
  'ILS' : 'IL',
  'INR' : 'IN',
  'KRW' : 'KR',
  'MWN' : 'MX',
  'MYR' : 'MY',
  'NZD' : 'NZ',
  'PHP' : 'PH',
  'SGD' : 'SG',
  'THB' : 'TH',
  'ZAR' : 'ZA'
  };


function traiteErreur(jqXHR, textStatus, errorThrown) {
  alert("Erreur " + errorThrown + " : " + textStatus);
}

function init(){
  console.log("coucou");
  $.ajax({
    url:"/historique",
    dataType: "json",
    type : "get",
    success : function(historiqueJson){
      time = "6:34:32";
      time_array = time.split(":");
      time_str = time_array.slice(0,2).join(":");
      console.log(time_str);
      entry = historiqueJson["6:34:32"];
      console.log(entry);
      keys = Object.keys(historiqueJson);
      $("#main").empty();
      $("#main").append($("<h1>").text("Historique des conversions"));
      for (var i=keys.length-1;i>=0;i--) {
        if(Object.keys(historiqueJson[keys[i]]).length==4 && historiqueJson[keys[i]]["value-1"]){
          //console.log(keys[i]);
          time = keys[i];
          time_array = time.split(":");
          time_str = time_array.slice(0,2).join(":");
          //console.log(time_str);
          entry = historiqueJson[time];
          //console.log(entry);
          /*$("#main").append($("<div>").attr("id",i));
          var str = "Conversion de "+entry["value-1"]+" "+entry["unit-1"]+" en "+entry["value-2"]+" "+entry["unit-2"]+" à "+time_str;
          $("#"+i).attr("class","col");
          //$("#"+i).attr("style","white-space: pre-line");
          $("#"+i).append($("<span>").text(str));
          $("#"+i).append($("<span>").attr("class","secondes"));
          $("#"+i).find(".secondes").text(":"+time_array[2]);
          $("#"+i).append($("<span>").text("."));*/
          $("#main").append($("<div>").attr("id",i));
          $("#"+i).attr("class","grid-container");

          var i_itemWide = i + "itemWide"
          $("#"+i).append($("<div>").attr("id",i_itemWide));
          $("#"+i_itemWide).attr("class","item-wide");
          var str1 = "À "+time_str;
          $("#"+i_itemWide).append($("<span>").text(str1));


          var i_item1 = i + "item1";
          $("#"+i).append($("<div>").attr("id",i_item1));
          $("#"+i_item1).attr("class","item");

          var i_img1 = i + "img1";
          $("#"+i_item1).append($("<img>").attr("id",i_img1));
          $("#"+i_img1).attr("class","drapeau");
          var url = generateFlagURL(entry["unit-1"]);      
          $("#"+i_img1).attr("src",url);

          var strA = entry["value-1"]+" "+entry["unit-1"];
          $("#"+i_item1).append($("<span>").text(strA));


          var i_item2 = i + "item2";
          $("#"+i).append($("<div>").attr("id",i_item2));
          $("#"+i_item2).attr("class","item");

          var i_img2 = i + "img2";
          $("#"+i_item2).append($("<img>").attr("id",i_img2));
          $("#"+i_img2).attr("class","drapeau");
          var url = generateFlagURL(entry["unit-2"]);     
          $("#"+i_img2).attr("src",url);

          var strB = entry["value-2"]+" "+entry["unit-2"];
          $("#"+i_item2).append($("<span>").text(strB));
        }
      }
      /*
      $("#1").append($("<span>").text("Conversion de "));
      $("#1").append($("<span>").attr("class","montant-1"));
      $("#1").find(".montant-1").text(entry["value-1"]);
      $("#1").append($("<span>").text(" "));
      $("#1").append($("<span>").attr("class","devise-1"));
      $("#1").find(".devise-1").text(entry["unit-1"]);
      $("#1").append($("<span>").text(" en "));
      $("#1").append($("<span>").attr("class","montant-2"));
      $("#1").find(".montant-2").text(entry["value-2"]);
      $("#1").append($("<span>").text(" "));*/
    },
    error: traiteErreur
  });
}