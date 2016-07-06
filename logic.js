var links = {};
var size = 0;

$('#input').blur(function (event) {
    setTimeout(function () { $("#input").focus(); }, 20);
});

var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope) {
  $scope.macros = macros;
  $scope.linkWord = linkWord;
});

$("#input").keyup(function (e) {
    if (e.keyCode == 13) {
      if (!document.getElementById("submit").disabled) {
        openLinks();
      }
    }
});

function openLinks() {
  var isFirst = true;
  for (var key in links) {
    if (links.hasOwnProperty(key)) {
      if (isFirst) {
        window.open(links[key], '_self');
        isFirst = false;
      } else {
        window.open(links[key], '_blank');
      }
    }
  }
  links = {};
  size = 0;
  document.getElementById("submit").disabled = true;
}

app.directive("colorchange", function() {
  return {
    transclude: true,
    template: '<div ng-transclude></div>',
    link: function(scope,elem,attrs) {
      var previous = "";
      setInterval(function() {
        if (scope.text != null && previous != scope.text) {
          links = {};
          size = 0;
          previous = scope.text;
          var arr = scope.text.split(" ");
          var result = "";
          var valid = true;

          for (var i = 0; i < arr.length; i++) {
            if (arr[i] in macros) {
              valid = true;
              if (macros[arr[i]].hasOwnProperty("linkPlus") && i + 1 < arr.length && arr[i + 1] != linkWord) {
                var temp = i + 1;
                var str = arr[i];
                var finalLink = macros[str].linkPlus;
                arr[i] = '<span style="color: ' + macros[arr[i]].color + '">'+arr[i];

                while (temp < arr.length && arr[temp] != linkWord) {
                  if (temp != i + 1) {
                    finalLink += "+";
                  }
                  finalLink += arr[temp];
                  arr[i] += " "+arr[temp];
                  arr[temp] = "";
                  temp += 1;
                }

                arr[i] += '</span>'
                links[finalLink] = finalLink;
                size += 1;
              } else {
                links[macros[arr[i]].linkref] = macros[arr[i]].linkref;
                size += 1;
                arr[i] = '<span style="color: ' + macros[arr[i]].color + '">'+arr[i]+'</span>';
              }
            } else if (arr[i] === linkWord){
              arr[i] = '<span style="color: '+linkColor+';font-weight: bold;">'+linkWord+'</span>';
              valid = false;
            } else {
              arr[i] = '<span style="color: grey">'+arr[i]+'</span>';
            }
            if (i != 0) {
              result += " ";
            }
            result += arr[i];
          }
          elem[0].innerHTML = result;
          if (size == 0 || !valid) {
            document.getElementById("submit").disabled = true;
          } else {
            document.getElementById("submit").disabled = false;
          }
        }
      },10);
    }
  }
});
