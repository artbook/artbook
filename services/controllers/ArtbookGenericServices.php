<?php

class ArtbookGenericServices {

    public static function sendEmail($f3){
        if($f3->get('SESSION.language') != NULL){
            $language = $f3->get('SESSION.language');
        }else{
            $language = $f3->get('DEFAULT_LANGUAGE');
        }
        $emailType = $f3->get('PARAMS.emailType');

        if($emailType === "question"){
            $qName       = $f3->get('POST.qName');
            $qEmail      = $f3->get('POST.qEmail');
            $qPhone      = $f3->get('POST.qPhone');
            $qQuestion   = $f3->get('POST.qQuestion');
            $qProdId     = $f3->get('POST.qProdId');

            $to = $f3->get('EMAIL_ADMIN');
            $subject = $f3->get('PRODUCT_QUESTION_EMAIL_SUBJECT')."  ".$qProdId;
            $message = "The details are:". "\n" .
                       "From:" . $qName . "\n" .
                       "Email:" . $qEmail . "\n" .
                       "Phone:" . $qPhone . "\n" .
                       "Question:" . $qQuestion . "\n";
            $from = "artbook@intello.ro";
            $headers = "From:" . $from;
            mail($to,$subject,$message,$headers);
            echo "Mail Sent Successfully.";
            return "Mail Sent Successfully.";
        }
    }

}