artbookApp = angular.module("artbookApp", ['infinite-scroll']);

artbookApp.filter('iif', function () {
    return function(input, trueValue, falseValue) {
        return input ? trueValue : falseValue;
    };
});


artbookApp.directive('zoomDirective', function() {
    return function(scope, element, attrs) {
        if (scope.$last){
            jQuery('.jqzoom').jqzoom({
                zoomType: 'innerzoom',
                preloadImages: false,
                alwaysOn:false
            });
            scope.initReviews($("#productId").text());
        }
    };
});

artbookApp.directive('imagesPostRepeatDirective', function() {
    return function(scope, element, attrs) {
        if (scope.$last){
            $(".scrollable").scrollable();
        }
    };
});

artbookApp.doGet = function(http ,url, retryLimit, callCallback){
    if(retryLimit === 0 ){
        callCallback(false);
    }

    http.get(url).success(function(data) {
        callCallback(data);
    }).error(function(){
         artbookApp.doGet(http, url, retryLimit - 1, callCallback );
    });
}

artbookApp.doPostAsForm = function(http, url, params, retryLimit, callCallback){
    if(retryLimit === 0 ){
        callCallback(false);
    }

    http.post(url, params,
                         {
                             headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                         }
             ).success(function(data) {
                    callCallback(data);
    }).error(function(){
            artbookApp.doPostAsForm(http, url, params, retryLimit - 1, callCallback );
        });
}

function ArtbookHomeCtrl($scope, $http) {
    var currentPage = window.location.href.split('/').pop();
    if(currentPage === ""){
        currentPage = "index.html";
    }

    $http.get('/services/menuLinks/'+ currentPage).success(function(data) {
        $scope.menuLinks = data;
    });

    $http.get('/services/banners').success(function(data) {
        $scope.banners = data;
    });

    $http.get('/services/targets').success(function(data) {
        $scope.targets = data;
    });
}

function LanguageCtrl($scope, $window, $http) {
        $scope.onLanguageChange = function(language){
            $http.get('/services/changeLanguage/'+language).success(function(data) {
                $window.location.reload();
        });
    }
}

/*
  *
  *
  * PRODUCTS CONTROLLER
  *
  *
 */
function ArtbookProductsCtrl($scope, $http) {
    $scope.currentCategory = "all";
    $scope.currentSubCategory = "all";

    artbookApp.doGet($http, '/services/menuLinks/'+window.location.href.split('/').pop(), 5, function(data){
        $scope.menuLinks = data;
    });

    artbookApp.doGet($http, "/services/languageCommon/products", 5, function(data){
            $scope.dictionary = data;
    });

    artbookApp.doGet($http, "/services/productsMenu", 5, function(data){
        $scope.categories = data;
    });

    artbookApp.doGet($http, "/services/products/1/all"+"/0", 5, function(data){
        $scope.products = data;

        $scope.products2view = [];
        for(var i=0; i<$scope.products.length;i=i+2){
            var productSet = [];
            if($scope.products[i] != undefined){
                productSet.push($scope.products[i]);
            }
            if($scope.products[i+1] != undefined){
                productSet.push($scope.products[i+1]);
            }
            $scope.products2view.push(productSet);
        }

        $scope.products3view = [];
        for(var i=0; i<$scope.products.length;i=i+3){
            var productSet = [];
            if($scope.products[i] != undefined){
                productSet.push($scope.products[i]);
            }
            if($scope.products[i+1] != undefined){
                productSet.push($scope.products[i+1]);
            }
            if($scope.products[i+2] != undefined){
                productSet.push($scope.products[i+2]);
            }
            $scope.products3view.push(productSet);
        }

        artbookApp.doGet($http,'/services/countProducts/1/all', 5, function(data) {
            $scope.productPages = data;
            if($scope.productPages.length > 0){
                $("#productPagesActive").text($scope.dictionary[0].page +'  ' + $scope.productPages[0].name);
            }else{
                $("#productPagesActive").text('');
            }
        });

        $scope.currentCategory = 1;
        $scope.currentSubCategory = "all";
    });

    $scope.filterCategory= function(category, index){
    if(category === null || category === undefined){
        category = 'all';
    }

    var categoryStatus = document.getElementById('category'+index).className;

    if(categoryStatus.indexOf('left_nav_close') != -1){
        artbookApp.doGet($http,'/services/products/'+category+'/all'+'/0', 5, function(data) {
            $scope.products = data;

            $scope.products2view = [];
            for(var i=0; i<$scope.products.length;i=i+2){
                var productSet = [];
                if($scope.products[i] != undefined){
                    productSet.push($scope.products[i]);
                }
                if($scope.products[i+1] != undefined){
                    productSet.push($scope.products[i+1]);
                }
                $scope.products2view.push(productSet);
            }

            $scope.products3view = [];
            for(var i=0; i<$scope.products.length;i=i+3){
                var productSet = [];
                if($scope.products[i] != undefined){
                    productSet.push($scope.products[i]);
                }
                if($scope.products[i+1] != undefined){
                    productSet.push($scope.products[i+1]);
                }
                if($scope.products[i+2] != undefined){
                    productSet.push($scope.products[i+2]);
                }
                $scope.products3view.push(productSet);
            }

            artbookApp.doGet($http,'/services/countProducts/'+category+'/all', 5, function(data) {
               $scope.productPages = data;

               if($scope.productPages.length > 0){
                   $("#productPagesActive").text($scope.dictionary[0].page +'  ' + $scope.productPages[0].name);
               }else{
                   $("#productPagesActive").text('');
               }
            });
        });

        $('.toggle_open').attr("class", "toggle_close");
        $('.left_nav_open').attr("class","left_nav_close");
    }
        menuJS.toggleDiv('subcategory' + index);
        menuJS.toggleImage('category' + index);

        $scope.currentCategory = category;
        $scope.currentSubCategory = "all";
    }

    $scope.filterSubCategory= function(category, subcategory){
        if(category === null || category === undefined){
            category = 'all';
        }
        if(subcategory === null || subcategory === undefined){
            subcategory = 'all';
        }

        artbookApp.doGet($http, '/services/products/'+category+'/'+subcategory+"/0", 5, function(data) {
            $scope.products = data;

            $scope.products2view = [];
            for(var i=0; i<$scope.products.length;i=i+2){
                var productSet = [];
                if($scope.products[i] != undefined){
                    productSet.push($scope.products[i]);
                }
                if($scope.products[i+1] != undefined){
                    productSet.push($scope.products[i+1]);
                }
                $scope.products2view.push(productSet);
            }

            $scope.products3view = [];
            for(var i=0; i<$scope.products.length;i=i+3){
                var productSet = [];
                if($scope.products[i] != undefined){
                    productSet.push($scope.products[i]);
                }
                if($scope.products[i+1] != undefined){
                    productSet.push($scope.products[i+1]);
                }
                if($scope.products[i+2] != undefined){
                    productSet.push($scope.products[i+2]);
                }
                $scope.products3view.push(productSet);
            }

            artbookApp.doGet($http,'/services/countProducts/'+category+'/'+subcategory, 5, function(data) {
                $scope.productPages = data;
                if($scope.productPages.length > 0){
                    $("#productPagesActive").text($scope.dictionary[0].page +'  ' + $scope.productPages[0].name);
                }else{
                    $("#productPagesActive").text('');
                }
            });
        });

        $scope.currentCategory = category;
        $scope.currentSubCategory = subcategory;
    }

    $scope.onProductsSort= function(newValue, newId){
        $scope.orderProp = newValue;
        $("#activeSortCriteria").empty();
        $("#"+newId).clone().appendTo("#activeSortCriteria");

    }

    $scope.changePage = function(pageName, pageId){
        console.log("changing page");
        var offset = 0;
        if(pageId === 'all'){
            offset = -1;
        }else{
            var pageLimits = pageName.split(" ");
            offset = pageLimits[0];
            if(offset > 0 ){offset = offset-1;}
        }

        $("#productPagesActiveContainer").empty();
        $("#order"+pageId).clone().appendTo("#productPagesActiveContainer");

        artbookApp.doGet($http, '/services/products/'+$scope.currentCategory+'/'+$scope.currentSubCategory+"/" + offset, 5, function(data) {
            $scope.products = data;
        });
    }

    $scope.addToCart = function(productId, tab){
        var tabs = ['TabOne', 'TabTwo', 'TabThree'];

        var quantityValue = parseInt(($("#quantity"+ tab +productId).val())? $("#quantity"+ tab +productId).val() : 0);
        for(var i=0; i<quantityValue; i++){
            $("#addToCart"+ tab + productId).trigger('click');
        }

        for(var tabIndex=0; tabIndex < tabs.length; tabIndex++){
            $("#quantity"+ tabs[tabIndex] +productId).val(1);
        }
    }

    $scope.increaseProductQuantity = function(productId, tab){
        var tabs = ['TabOne', 'TabTwo', 'TabThree'];
        var currentValue = parseInt(($("#quantity"+ tab +productId).val())? $("#quantity"+ tab +productId).val() : 0);

        for(var tabIndex=0; tabIndex < tabs.length; tabIndex++){
            $("#quantity"+ tabs[tabIndex] +productId).val(currentValue+1);
        }
    }

    $scope.decreaseProductQuantity = function(productId, tab){
        var tabs = ['TabOne', 'TabTwo', 'TabThree'];

        var currentValue = parseInt(($("#quantity"+ tab +productId).val())? $("#quantity"+ tab +productId).val() : 0);
        if(currentValue-1 < 0){
            newValue = 0;
        }else{
            newValue = currentValue - 1;
        }
        for(var tabIndex=0; tabIndex < tabs.length; tabIndex++){
            $("#quantity"+ tabs[tabIndex] +productId).val(newValue);
        }
    }
}


function ArtbookProductDetailsCtrl($scope, $http) {
    /*
     * Retreive the menuLinks via the menuLinks JSON
     */
    artbookApp.doGet($http, '/services/menuLinks/products.html', 5, function(data){
        $scope.menuLinks = data;
    });

    /*
     * Retreive the languageCommon JSON
     */
    artbookApp.doGet($http, "/services/languageCommon/products", 5, function(data){
        $scope.dictionary = data;

        if($scope.dictionary[0].language === 'RO'){
            var script   = document.createElement("script");
            script.type  = "text/javascript";
            script.src   = "js/products/messages.ro.js";    // use this for linked script
            document.body.appendChild(script);
        }
    });

    /*
     * Retreive the currentProductDetails JSON
     */
    artbookApp.doGet($http, "/services/productDetails/"+ window.location.href.split('/').pop(), 5, function(data){
        $scope.product = data;
    });

    $scope.addToCart = function(productId){
        var quantityValue = parseInt(($("#quantity"+productId).val())? $("#quantity"+productId).val() : 0);
        for(var i=0; i<quantityValue; i++){
            $("#addToCart"+productId).trigger('click');
        }
        $("#quantity"+productId).val(1);
    }

    $scope.increaseProductQuantity = function(productId){
        var currentValue = parseInt(($("#quantity"+productId).val())? $("#quantity"+productId).val() : 0);
        $("#quantity"+productId).val(currentValue+1);
    }

    $scope.decreaseProductQuantity = function(productId, tab){
        var currentValue = parseInt(($("#quantity"+productId).val())? $("#quantity"+productId).val() : 0);
        if(currentValue-1 < 0){
            newValue = 0;
        }else{
            newValue = currentValue - 1;
        }
        $("#quantity"+productId).val(newValue);
    }

    /*
     * Function called when one of the product thumbs are clicked. The function will change
     * the main product image to the src received as parameter
     */
    $scope.changeMainProductImg = function(src){
        if($("#productImageZoom").attr("src") !== src){
            $("#productHrefZoom").attr('href',src);
            $("#productImageZoom").attr("src",src);

            /*
             * Reinit zoom on product big image
             */
            $('.jqzoom').removeData('jqzoom');
            $(".jqzoom").unbind();
            $(".jqzoom").jqzoom({
                zoomType: 'innerzoom',
                preloadImages: true,
                alwaysOn:false
            });
        }
    }

    $scope.rateProduct = function(productId){

        $rateValue = $("#currentRatingScore").val();
        if($rateValue == null || $rateValue == undefined){
            $rateValue = 0;
        }

        $rateOpinionText = $("#rateOpinionText").val();
        if($rateOpinionText ===null || $rateOpinionText === undefined || $rateOpinionText === "" ){
            $("#rateOpinionText").addClass("redBorder").focus(function()  {
                $("#rateOpinionText").removeClass("redBorder");
            });
            return;
        }
        if($rateOpinionText==null || $rateOpinionText == undefined){
            $rateOpinionText = "";
        }

        $formData = $.param({rateOpinion: $rateOpinionText});
        artbookApp.doPostAsForm($http,'/services/rateProduct/'+productId+'/'+$rateValue, $formData, 5, function(data) {
            $scope.product[0].ratingStyle=data;
        });

        /*
         * Clear the rating form
         */
        $("#ratyRating").raty('reload');
        $("#rateOpinionText").val('');
        $("#rateProductPopup").bPopup().close();
    }

    $scope.askQuestionEmail = function(){
        if($('#askQuestionForm').parsley('isValid')===false) return;

        var formData = "qName="+$("#qName").val()+"&"+"qEmail="+$("#qEmail").val()+"&"+"qPhone="+$("#qPhone").val()+"&"+"qQuestion="+$("#qQuestion").val()+"&"+"qProdId="+$("#qProdId").val();
        artbookApp.doPostAsForm($http,'/services/sendEmail/question', formData, 5, function(data) {});
        $("#askQuestionpopup").bPopup().close();
        $('#mailConfirmationPopup').bPopup({
            modalClose: false
        });
    }

    $scope.checkout = function(){
        var checkoutData = simpleCart.checkout['SendForm'].call(simpleCart, "");
        if(checkoutData.data.itemCount === 0){
            $('#checkOutPopupContent').append('<h2>'+$scope.dictionary[0].noProductSelectedForCheckout+'</h2>');
            $scope.tmpCart = null;
            return;
        }

        if($scope.tmpCart == null || $scope.tmpCart == undefined){
            $scope.tmpCart = $("#shoppingCartContent").children().clone();

            $scope.tmpCart.find(".cartInfo").remove();
            $scope.tmpCart.find("#cartPopover").addClass("cartPopoverRel").removeClass("cartPopover").attr("id","tmpCartPopover");
            $scope.tmpCart.children().find(".simpleCart_increment").remove();
            $scope.tmpCart.children().find(".simpleCart_decrement").remove();
            $scope.tmpCart.children().find("#popoverButtons").remove();

            $scope.tmpCart.attr("id", "tmpCart");
            $scope.tmpCart.attr("style", "padding-left:220px;");

            $('#checkOutPopupContent').html($scope.tmpCart);
        }

        $('#checkOutPopup').bPopup({
            easing: 'easeOutBack',
            speed: 450,
            transition: 'slideDown',
            modalClose: false
        });

        $("#cartPopover").hide();
        $(".cartInfo").removeClass('open');
    }

    $scope.performActualCheckout = function(){
        if($('#checkoutForm').parsley('isValid')===false) return;

        var checkoutData = simpleCart.checkout['SendForm'].call(simpleCart, "");
        var formData;
        simpleCart.each(checkoutData.data, function (val, x, name) {
            formData += name + "=" + val + "&";
        });
        formData += "cName=" + $("#cName").val() + "&" + "cEmail=" + $("#cEmail").val() + "&" + "cPhone=" + $("#cPhone").val() + "&";
        artbookApp.doPostAsForm($http,'/services/checkout', formData, 5, function(data) {
            if(data === "success"){
                simpleCart.empty();
                $("#checkOutPopup").bPopup().close();

                $('#checkOutSuccessPopup').bPopup({
                    easing: 'easeOutBack',
                    speed: 450,
                    transition: 'slideDown',
                    modalClose: false,
                    position: [575, 150]
                });
            }else{
                $('#checkOutPopup').append('<h2>'+$scope.dictionary[0].checkoutError+'</h2>');
            }
        });
    }

    /*
     * Infinite Scroll
     */
    $scope.busy = false;
    $scope.after=0;
    $scope.ratingsPages=0;

    $scope.initReviews = function(productId){
        artbookApp.doGet($http, "/services/productRatings/"+productId+"/0" , 5, function(data){
            $scope.items = data;
            $scope.after = data.length;
        });

        artbookApp.doGet($http, "/services/productRatingsPages/"+productId , 5, function(data){
            $scope.ratingsPages=data;
            $scope.ratingsPages--;
        });
    }

    $scope.nextPage = function(productId) {
        if ($scope.busy) return;
        if (productId === null || productId === undefined ) return;

        $scope.busy = true;
        artbookApp.doGet($http, "/services/productRatings/"+productId + "/"+ $scope.after , 5, function(data){
            for (var i = 0; i < data.length; i++) {
                $scope.items.push(data[i]);
            }
            $scope.after = $scope.after + data.length;
            /*
             * Another page has been processed
             */
            $scope.ratingsPages--;

            /*
             * Check to see if the scroll should stop
             */
            if($scope.ratingsPages === 0){
                $scope.busy = true;
            }else{
                $scope.busy = false;
            }
        });
    };
}

function ArtbookAboutCtrl($scope, $http) {
    var currentPage = window.location.href.split('/').pop();
    if(currentPage === ""){
        currentPage = "index.html";
    }

    $http.get('/services/menuLinks/'+ currentPage).success(function(data) {
        $scope.menuLinks = data;
    });
}

function ArtbookContactCtrl($scope, $http) {
    var currentPage = window.location.href.split('/').pop();
    if(currentPage === ""){
        currentPage = "index.html";
    }

    $http.get('/services/menuLinks/'+ currentPage).success(function(data) {
        $scope.menuLinks = data;
    });
}