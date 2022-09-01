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
    var menuItemsUrl ="https://davids-restaurant.herokuapp.com/menu_items.json?category=";
    var menuItemsTitleHtml = "snippets/menu-item-title.html";
    var menuItemHtml = "snippets/menu-item.html";
    var insertProperty =function(string,propName,propValue){
        var propString = "{{" + propName + "}}";
        string = string.replace(new RegExp(propString,"g"),propValue);
        return string;
    }
    //load menu categories
    dc.loadMenuCategories = function(){
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(allCategoriesUrl,buildAndShowCategoriesHTML);
    }
    dc.loadMenuItems = function (categoryShort) {
      showLoading("#main-content");
      $ajaxUtils.sendGetRequest(
        menuItemsUrl + categoryShort,
        buildAndShowMenuItemsHTML);
    };

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
    // Insert category's values
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

    function buildAndShowMenuItemsHTML (categoryMenuItems) {
      $ajaxUtils.sendGetRequest(
        menuItemsTitleHtml,
        function (menuItemsTitleHtml) {

          $ajaxUtils.sendGetRequest(
            menuItemHtml,
            function (menuItemHtml) {
              var menuItemsViewHtml =
                buildMenuItemsViewHtml(categoryMenuItems,
                                       menuItemsTitleHtml,
                                       menuItemHtml);
              insertHtml("#main-content", menuItemsViewHtml);
            },
            false);
        },
        false);
    }

    function buildMenuItemsViewHtml(categoryMenuItems,menuItemsTitleHtml,menuItemHtml) {
      menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,"name",categoryMenuItems.category.name);
      menuItemsTitleHtml =  insertProperty(menuItemsTitleHtml,"special_instructions",categoryMenuItems.category.special_instructions);
      var finalHtml = menuItemsTitleHtml;
      finalHtml += "<section class='row'>";
      // Loop over menu items
      var menuItems = categoryMenuItems.menu_items;
      var catShortName = categoryMenuItems.category.short_name;
      for (var i = 0; i < menuItems.length; i++) {
      // Insert menu item values
      var html = menuItemHtml;
      html = insertProperty(html, "short_name", menuItems[i].short_name);
      html =insertProperty(html,"catShortName",catShortName);
      html = insertItemPrice(html,"price_small",menuItems[i].price_small);
      html = insertItemPortionName(html,"small_portion_name",menuItems[i].small_portion_name);
      html = insertItemPrice(html,"price_large",menuItems[i].price_large);
      html =  insertItemPortionName(html,"large_portion_name",menuItems[i].large_portion_name);
      html = insertProperty(html,"name",menuItems[i].name);
      html = insertProperty(html,"description",menuItems[i].description);

// Add clearfix after every second menu item
      if (i % 2 != 0) {
      html +="<div class='clearfix visible-lg-block visible-md-block'></div>";
      }

      finalHtml += html;
      }

      finalHtml += "</section>";
      return finalHtml;
    }
    function insertItemPrice(html,pricePropName,priceValue) {
      // If not specified, replace with empty string
            if (!priceValue) {
              return insertProperty(html, pricePropName, "");
            }
            priceValue = "$" + priceValue.toFixed(2);
            html = insertProperty(html, pricePropName, priceValue);
            return html;
    }

    function insertItemPortionName(html,portionPropName,portionValue) {
// If not specified, return original string
      if (!portionValue) {
        return insertProperty(html, portionPropName, "");
      }
      portionValue = "(" + portionValue + ")";
      html = insertProperty(html, portionPropName, portionValue);
      return html;
    }
    // function to insert innerHTML for 'select'
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
