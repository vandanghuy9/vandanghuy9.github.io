$(function(){
    $("#navbarToggle").blur(function(event){
        var screenWidth = window.innerWidth;
        if(screenWidth <992){
            console.log(screenWidth);
            $("#collapsablenav").collapse('hide');
        }
    })
});

(function (global) {

    var dc = {};
    
    var homeHtml = "snippets/home-snippet.html";
    var allCategoriesUrl ="https://davids-restaurant.herokuapp.com/categories.json";
    var categoriesTitleHtml = "snippets/categories-title-snippet.html";
    var categoryHtml = "snippets/categories-snippet.html";
    var InsertProperty =function(string,propName,propValue){
        var propString = "{{" + propName + "}}";
        string = string.replace(new RegExp(propString,"g"),propValue);
        return string;
    }
    //load menu categories
    dc.loadMenuCategories = function(){
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(allCategoriesUrl,buildAndShowCategoriesHTML);
    }

    function buildAndShowCategoriesHTML(categories){
        $ajaxUtils.sendGetRequest(
            categoriesTitleHtml,
            function (categoriesTitleHtml) {
              $ajaxUtils.sendGetRequest(
                categoryHtml,
                function (categoryHtml) {
                  var categoriesViewHtml =
                    buildCategoriesViewHtml(categories,
                                            categoriesTitleHtml,
                                            categoryHtml);
                  insertHtml("#main-content", categoriesViewHtml);
                },
                false);
            },
        false);
    }

    function buildCategoriesViewHtml(categories,categoriesTitleHtml,categoryHtml) {
        var finalHtml = categoriesTitleHtml;
        finalHtml += "<section class='row'>";

        for (var i = 0; i < categories.length; i++) {
    // Insert category values
        var html = categoryHtml;
        var name = "" + categories[i].name;
        var short_name = categories[i].short_name;
        html =insertProperty(html, "name", name);
        html =insertProperty(html,"short_name",short_name);
        finalHtml += html;
        }
        finalHtml += "</section>";
        return finalHtml;
    }


    // Convenience function for inserting innerHTML for 'select'
    var insertHtml = function (selector, html) {
      var targetElem = document.querySelector(selector);
      targetElem.innerHTML = html;
    };
    
    // Show loading icon inside element identified by 'selector'.
    var showLoading = function (selector) {
      var html = "<div class='text-center'>";
      html += "<img src='images/ajax-loader.gif'></div>";
      insertHtml(selector, html);
    };
    
    // On page load (before images or CSS)
    document.addEventListener("DOMContentLoaded", function (event) {
    
    // On first load, show home view
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      homeHtml,
      function (responseText) {
        document.querySelector("#main-content")
          .innerHTML = responseText;
      },
      false);
    });
    
    
    global.$dc = dc;
    
    })(window);
//js automatically convert var type 
// if dont want to convert, use === in compare
