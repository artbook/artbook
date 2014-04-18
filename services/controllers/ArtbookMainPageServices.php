<?php

class ArtbookMainPageServices {

    public static function retreiveLanguageCommonJSON($f3){
        if($f3->get('SESSION.language') != NULL){
            $language = $f3->get('SESSION.language');
        }else{
            $language = $f3->get('DEFAULT_LANGUAGE');
        }

        $forPage = $f3->get('PARAMS.page');

        $dictionaryTable = new DB\SQL\Mapper($f3->get('DB'),'artbook_languageCommon');
        $dictionary = $dictionaryTable->find(array('(target_page=? OR target_page="all") AND language=?', $forPage, $language));

        $json_result = array();
        foreach ($dictionary as $item){
            $json_result[$item->NAME] =  $item->VALUE;
        }

        echo '['.json_encode($json_result).']';
        return true;
    }

    /*
     * Static function to return the mainMenuLinksJSON
     */
    public static function retreiveMenuLinksJSON($f3) {
        if($f3->get('SESSION.language') != NULL){
            $language = $f3->get('SESSION.language');
        }else{
            $language = $f3->get('DEFAULT_LANGUAGE');
        }

        $currentPage = $f3->get('PARAMS.page');

        $linksTable = new DB\SQL\Mapper($f3->get('DB'),'artbook_links');
        $links = $linksTable->find(array('type=? AND language=?','mainmenu', $language),array('order'=>'SEQUENCE'));

        $json_result = array();
        foreach ($links as $link){
            array_push($json_result,
                        array(
                            "URL"       => $link->URL,
                            "isCurrent" => $link->URL === $currentPage ? 1 : 0,
                            "Title"     => $link->TITLE,
                            "Name"      => $link->NAME
                        )
            );
        }
        echo json_encode($json_result);
        return true;
    }

    public static function retreiveBannersJSON($f3){
        if($f3->get('SESSION.language') != NULL){
            $language = $f3->get('SESSION.language');
        }else{
            $language = $f3->get('DEFAULT_LANGUAGE');
        }

        $bannersTable = new DB\SQL\Mapper($f3->get('DB'),'artbook_banners');
        $banners = $bannersTable->find(array('language=?', $language));

        $json_result = array();
        foreach ($banners as $banner){
            array_push($json_result,
                array(
                    "description"    => $banner->IMAGE_DESCRIPTION,
                )
            );
        }

        echo json_encode($json_result);
        return true;
    }

    public static function retreiveTargetsJSON($f3){
        if($f3->get('SESSION.language') != NULL){
            $language = $f3->get('SESSION.language');
        }else{
            $language = $f3->get('DEFAULT_LANGUAGE');
        }

        $targetsTable = new DB\SQL\Mapper($f3->get('DB'),'artbook_targets');
        $targets = $targetsTable->find(array('active=? AND language=?', 1, $language), array('order'=>'NR_CRT'));

        $json_result = array();
        foreach ($targets as $target){
            array_push($json_result,
                array(
                    "image"                     => $target->IMAGE,
                    "title"                     => $target->TITLE,
                    "shortDescription"          => $target->SHORTDESC,
                    "contents"                  => $target->CONTENT,
                    "isVisible"                 => $target->DETAILS_VISIBLE,
                    "tooltipTitle"              => $target->TOOLTIP_TITLE,
                    "tooltipDesc"               => $target->TOOLTIP_DESC,
                    "tooltipUrl"                => $target->TOOLTIP_URL,
                    "tooltipUrlLabel"           => $target->TOOLTIP_URL_LABEL,
                )
            );
        }

        echo json_encode($json_result);
        return true;
    }

    public static function performChangeLanguage($f3){
        /*
         * Read the new language parameter
         */
        $language = $f3->get('PARAMS.language');

        /*
         * Set the Language Parameter on the session
         */
        $f3->set('SESSION.language', $language);
        echo "Language Changed to " . $language;
    }
}
