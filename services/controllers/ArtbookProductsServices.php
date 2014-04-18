<?php

class ArtbookProductsServices {

    public static function getPageSizeLimit($productsCount){
        if($productsCount <= 100){
            return 10;
        }else{
            if($productsCount <= 1000){
                return 50;
            }else{
                return  100;
            }
        }
    }

    public static function retreiveProductsMenuJSON($f3){
        if($f3->get('SESSION.language') != NULL){
            $language = $f3->get('SESSION.language');
        }else{
            $language = $f3->get('DEFAULT_LANGUAGE');
        }

        $categoriesTable = new DB\SQL\Mapper($f3->get('DB'),'artbook_categories');
        $categories = $categoriesTable->find(array('active=?', 1), array('order'=>'NR_CRT'));

        $json_result = array();
        foreach ($categories as $category){
            $categoriesDetailsTable = new DB\SQL\Mapper($f3->get('DB'),'artbook_categories_details');
            $categoriesDetails = $categoriesDetailsTable->find(array('ID_CATEGORY=?', $category->ID));

            $subcategoriesTable = new DB\SQL\Mapper($f3->get('DB'),'artbook_subcategories');
            $subcategories = $subcategoriesTable->find(array('CATEGORY_ID=?', $category->ID), array('order'=>'NR_CRT'));

            $subcategories_array = array();
            foreach($subcategories as $subcategory){
                $subcategoriesDetailsTable = new DB\SQL\Mapper($f3->get('DB'),'artbook_subcategories_details');
                $subcategoriesDetails = $subcategoriesDetailsTable->find(array('ID_SUBCATEGORY=? AND LANGUAGE=?', $subcategory->ID, $language));

                array_push($subcategories_array,
                           array(
                              "id"   => $subcategory->ID,
                              "name"  => $subcategoriesDetails[0]->NAME
                           )
                          );
            }
            array_push($json_result,
                array(
                    "id"             => $category->ID,
                    "name"           => $categoriesDetails[0]->NAME,
                    "subcategories"  => $subcategories_array
                )
            );
        }

        if(sizeof($json_result) == 0 ){
            array_push($json_result,
                array(
                    "name"           => "None"
                )
            );
        }
        echo json_encode($json_result);
        return true;
    }

    public static function retreiveProductsInCategory($f3){
        if($f3->get('SESSION.language') != NULL){
            $language = $f3->get('SESSION.language');
        }else{
            $language = $f3->get('DEFAULT_LANGUAGE');
        }

        $currentCategory = $f3->get('PARAMS.category');
        $currentSubCategory = $f3->get('PARAMS.subcategory');
        $currentOffset = $f3->get('PARAMS.offset');

        $productsTable = new DB\SQL\Mapper($f3->get('DB'),'artbook_products');
        if($currentCategory != null && $currentCategory != 'all' && $currentSubCategory != null && $currentSubCategory != 'all'){
            /*
             * Products filtered by category and subcategory
             */
            $productsCount = $productsTable->count(array('active=? AND category_id=? AND subcategory_id=?',
                                                          1, $currentCategory, $currentSubCategory), array('order'=>'NR_CRT'));

            if($currentOffset == -1){
                //need to set all results
                $options_array = array('order'=>'NR_CRT');
            }else{
                $options_array = array('order'=>'NR_CRT', 'offset'=>$currentOffset, 'limit'=> self::getPageSizeLimit($productsCount));
            }

            $products = $productsTable->find(array('active=? AND category_id=? AND subcategory_id=?',
                                                    1, $currentCategory, $currentSubCategory), $options_array);
        }else{
            if($currentCategory != null && $currentCategory != 'all' && $currentSubCategory != null && $currentSubCategory == 'all'){
                /*
                 * Products filtered only by category
                 */
                $productsCount = $productsTable->count(array('active=? AND category_id=?',
                                                             1, $currentCategory), array('order'=>'NR_CRT'));
                if($currentOffset == -1){
                    //need to set all results
                    $options_array = array('order'=>'NR_CRT');
                }else{
                    $options_array = array('order'=>'NR_CRT', 'offset'=>$currentOffset, 'limit'=> self::getPageSizeLimit($productsCount));
                }
                $products = $productsTable->find(array('active=? AND category_id=?',
                                                        1, $currentCategory), $options_array );
            }else{
                /*
                 * All products
                 */
                $productsCount = $productsTable->count(array('active=?', 1), array('order'=>'NR_CRT'));
                if($currentOffset == -1){
                    //need to set all results
                    $options_array = array('order'=>'NR_CRT');
                }else{
                    $options_array = array('order'=>'NR_CRT', 'offset'=>$currentOffset, 'limit'=> self::getPageSizeLimit($productsCount));
                }
                $products = $productsTable->find(array('active=?', 1), $options_array );
            }
        }

        $productsDetailsTable = new DB\SQL\Mapper($f3->get('DB'),'artbook_products_details');
        $productImagesTable = new DB\SQL\Mapper($f3->get('DB'),'artbook_product_images');
        $json_result = array();
        foreach($products as $product){
            $productDetails = $productsDetailsTable->find(array('ID_PRODUCT=? AND language=?', $product->ID, $language) );
            $mainProductImage =  $productImagesTable->find(array('ID_PRODUCT=? AND ISMAIN=?', $product->ID, 1) );

            array_push($json_result,
                array(
                    "id"              => $product->ID,
                    "name"            => $productDetails[0]->NAME,
                    "price"           => $productDetails[0]->PRICE,
                    "originalPrice"   => $productDetails[0]->ORIGINALPRICE,
                    "image"           => $mainProductImage != null ? $mainProductImage[0]->IMAGE_URL : "",
                    "description"     => $productDetails[0]->DESCRIPTION,
                    "rating"          => $productDetails[0]->RATING,
                    "ratingStyle"     => $productDetails[0]->RATINGSTYLE,
                    "stockLevel"      => $productDetails[0]->STOCKCLASS
                )
            );
        }

        echo json_encode($json_result);
        return true;
    }

    public static function retreiveProductsPagesInCategory($f3){
        $pageSize = 0;

        if($f3->get('SESSION.language') != NULL){
            $language = $f3->get('SESSION.language');
        }else{
            $language = $f3->get('DEFAULT_LANGUAGE');
        }

        $currentCategory = $f3->get('PARAMS.category');
        $currentSubCategory = $f3->get('PARAMS.subcategory');

        $productsTable = new DB\SQL\Mapper($f3->get('DB'),'artbook_products');
        if($currentCategory != null && $currentCategory != 'all' && $currentSubCategory != null && $currentSubCategory != 'all'){
            /*
             * Products filtered by category and subcategory
             */
            $productsCount = $productsTable->count(array('active=? AND language=? AND category_id=? AND subcategory_id=?',
                                                    1, $language, $currentCategory, $currentSubCategory), array('order'=>'NAME'));
        }else{
            if($currentCategory != null && $currentCategory != 'all' && $currentSubCategory != null && $currentSubCategory == 'all'){
                /*
                 * Products filtered only by category
                 */
                $productsCount = $productsTable->count(array('active=? AND category_id=?',
                                                        1, $currentCategory), array('order'=>'NAME'));
            }else{
                /*
                 * All products
                 */
                $productsCount = $productsTable->count(array('active=? AND language=?', 1, $language), array('order'=>'NAME'));
            }
        }

        if($productsCount <= 100){
            $pageSize = 10;
        }else{
            if($productsCount <= 1000){
                $pageSize = 50;
            }else{
                $pageSize = 100;
            }
        }

        $json_result = array();
        $lastProductOnPage = 0;
        $step = 0;
        for($i = 0; $i<$productsCount; $i = $i + $pageSize){
            $pageLimit = $lastProductOnPage + $pageSize;
            array_push($json_result,
                        array(
                            "id" => $step,
                            "name" =>  ($lastProductOnPage===0 ? 1 : $lastProductOnPage) . "  " . ($pageLimit<$productsCount?$pageLimit:$productsCount)
                        )
                       );
            $lastProductOnPage = $lastProductOnPage + $pageSize;
            $step++;
        }

        if($productsCount > 0){
            array_push($json_result,
                array(
                    "id" => 'all',
                    "name" =>  "All results"
                )
            );
        }

        echo json_encode($json_result);
        return true;
    }

    public static function retreiveProductDetailsById($f3){
        if($f3->get('SESSION.language') != NULL){
            $language = $f3->get('SESSION.language');
        }else{
            $language = $f3->get('DEFAULT_LANGUAGE');
        }
        $productId = $f3->get('PARAMS.productId');

        $productsDetailsTable = new DB\SQL\Mapper($f3->get('DB'),'artbook_products_details');
        $productDetails = $productsDetailsTable->find(array('ID_PRODUCT=? AND language=?', $productId, $language) );

        $productImagesTable = new DB\SQL\Mapper($f3->get('DB'),'artbook_product_images');
        $productImages      =  $productImagesTable->find(array('ID_PRODUCT=? AND ISMAIN=?', $productId, 0) );

        $productImages_array = array();
        foreach($productImages as $productImage){
            array_push($productImages_array,
                array(
                    "id"         => $productImage->ID_PRODUCT_IMAGE,
                    "imageUrl"   => $productImage->IMAGE_URL,
                    "imageDesc"  => $productImage->IMAGE_DESC
                )
            );
        }
        $mainProductImage =  $productImagesTable->find(array('ID_PRODUCT=? AND ISMAIN=?', $productId, 1) );

        $productRatingsTable = new DB\SQL\Mapper($f3->get('DB'),'artbook_product_ratings');
        $productRatings      =  $productRatingsTable->find(array('ID_PRODUCT=?', $productId) );
        $productRatings_array = array();
        foreach($productRatings as $productRating){
            array_push($productRatings_array,
                array(
                    "id"         => $productRating->ID_PRODUCT_RATING,
                    "rateValue"  => $productRating->RATE_VALUE,
                    "opinion"    => $productRating->OPINION
                )
            );
        }

        $productImagesPages = array();
        $productImagesPagesCount = sizeOf($productImages_array)%6 === 0 ? sizeOf($productImages_array)/6 : floor(sizeOf($productImages_array)%6) + 1;

        $currentPageEndIndex = 0;
        for($i=1; $i<=$productImagesPagesCount;$i++){
            $pageEndIndex = 0;
            if(6*$i > sizeOf($productImages_array) ){
                $pageEndIndex = sizeOf($productImages_array);
            }else{
                $pageEndIndex = 6*$i;
            }
            array_push($productImagesPages,
                       array_slice($productImages_array, $currentPageEndIndex, $pageEndIndex )
                      );
            $currentPageEndIndex = $pageEndIndex;
        }
        $json_result = array();
        foreach($productDetails as $productDetail){
            array_push($json_result,
                array(
                    "id"              => $productDetail->ID_PRODUCT,
                    "name"            => $productDetail->NAME,
                    "price"           => $productDetail->PRICE,
                    "originalPrice"   => $productDetail->ORIGINALPRICE,
                    "description"     => $productDetail->DESCRIPTION,
                    "rating"          => $productDetail->RATING,
                    "ratingStyle"     => $productDetail->RATINGSTYLE,
                    "stockLevel"      => $productDetail->STOCKCLASS,
                    "mainImage"       => $mainProductImage != null ? $mainProductImage[0]->IMAGE_URL  : "",
                    "mainImageDesc"   => $mainProductImage != null ? $mainProductImage[0]->IMAGE_DESC : "",
                    "productImages"   => $productImagesPages,
                    "productRatings"  => $productRatings_array
                )
            );
        }

        echo json_encode($json_result);
        return true;
    }

    public static function rateProduct($f3){
        if($f3->get('SESSION.language') != NULL){
            $language = $f3->get('SESSION.language');
        }else{
            $language = $f3->get('DEFAULT_LANGUAGE');
        }
        $productId = $f3->get('PARAMS.productId');
        $rateValue = $f3->get('PARAMS.rateValue');
        $opinion   = $f3->get('POST.rateOpinion');


        /*
         * Insert the new rating for the product
         */
        $artBookRating=new DB\SQL\Mapper($f3->get('DB'),'artbook_product_ratings');
        $artBookRating->ID_PRODUCT=$productId;
        $artBookRating->RATE_VALUE=$rateValue;
        $artBookRating->OPINION=$opinion;
        $artBookRating->LANGUAGE=$language;
        $artBookRating->save();

        /*
         * Calculate the new overall rating
         */
        $newRatePercentage = "";
        $newRatePercentageResult = $f3->get('DB')->exec(
                                                            'SELECT ( (SUM(`RATE_VALUE`)*100) / (count(*)*5) ) as RATE_PRECENTAGE
                                                             FROM `artbook_product_ratings`
                                                             WHERE `ID_PRODUCT`=?'
                                                             ,
                                                             $productId
                                                        );

        if($newRatePercentageResult != null && sizeOf($newRatePercentageResult) > 0){
            $newRatePercentage = floor($newRatePercentageResult[0]['RATE_PRECENTAGE']);
            /*
             * Update the product with the new rating value
             */
            $f3->get('DB')->exec(
                                        'UPDATE `artbook_products_details`
                                         SET `RATING`=?,`RATINGSTYLE`=?
                                         WHERE `ID_PRODUCT`=?'
                                         ,
                                          array(
                                              1=>$newRatePercentage,
                                              2=>"width:".$newRatePercentage."%;",
                                              3=>$productId
                                          )
            );

            echo "width:".$newRatePercentage."%";
        }
    }


    public static function retreiveProductRatingsPages($f3){
        $productId = $f3->get('PARAMS.productId');

        $productRatingsTable = new DB\SQL\Mapper($f3->get('DB'),'artbook_product_ratings');
        $productRatingsCount =  $productRatingsTable->count( array('ID_PRODUCT=?', $productId) );

        echo ceil($productRatingsCount/10);
        return ceil($productRatingsCount/10);
    }

    public static function retreiveProductRatingsById($f3){
        if($f3->get('SESSION.language') != NULL){
            $language = $f3->get('SESSION.language');
        }else{
            $language = $f3->get('DEFAULT_LANGUAGE');
        }
        $productId     = $f3->get('PARAMS.productId');
        $currentOffset = $f3->get('PARAMS.offset');

        $options_array = array('order'=>'DATE DESC', 'offset'=>$currentOffset, 'limit'=> self::getPageSizeLimit(10));

        $productRatingsTable = new DB\SQL\Mapper($f3->get('DB'),'artbook_product_ratings');
        $productRatings      =  $productRatingsTable->find(array('ID_PRODUCT=?', $productId), $options_array);
        $productRatings_array = array();
        foreach($productRatings as $productRating){
            array_push($productRatings_array,
                array(
                    "id"         => $productRating->ID_PRODUCT_RATING,
                    "rateValue"  => $productRating->RATE_VALUE,
                    "rateStyle"  => "width:".($productRating->RATE_VALUE*20)."%;",
                    "opinion"    => $productRating->OPINION,
                    "language"   => $productRating->LANGUAGE,
                    "date"       => $productRating->DATE
                    )
                );
        }

        echo json_encode($productRatings_array);
        return true;
    }

    public static function  checkout($f3){
        if($f3->get('SESSION.language') != NULL){
            $language = $f3->get('SESSION.language');
        }else{
            $language = $f3->get('DEFAULT_LANGUAGE');
        }

        $itemCount = $f3->get('POST.itemCount');

        $newOrderMessage='<h1>New order from:'.$f3->get('POST.cName').'</h1>';
        $newOrderMessage.='<h2>Email:'.$f3->get('POST.cEmail').'<br>'
                         .'Phone:'.$f3->get('POST.cPhone')
                          .'</h2><br/>';

        $newOrderMessage .= '<html><body><table>';

        $newOrderMessage .= '<tr>';
        $newOrderMessage .= '<td>Name</td>';
        $newOrderMessage .= '<td>Quantity</td>';
        $newOrderMessage .= '<td>Product Id</td>';
        $newOrderMessage .= '</tr>';
        for($i=1;$i<=$itemCount;$i++){
            $paramName = $f3->get('POST.item_name_'.$i);
            $paramQuantity= $f3->get('POST.item_quantity_'.$i);
            $productId=$f3->get("POST.item_options_".$i);
            $newOrderMessage .= '<tr>';
            $newOrderMessage .= '<td>'.$paramName.'</td>';
            $newOrderMessage .= '<td>'.$paramQuantity.'</td>';
            $newOrderMessage .= '<td>'.$productId.'</td>';
            $newOrderMessage .= '</tr>';
        }
        $newOrderMessage .= '</table></body></html>';


        $to = $f3->get('EMAIL_ADMIN');
        $subject = $f3->get('PRODUCT_QUESTION_EMAIL_SUBJECT');
        $from = "artbook@intello.ro";
        $headers = "From:" . $from;
        mail($to,$subject,$newOrderMessage,$headers);

        echo "success";
        return "success";
    }
}
