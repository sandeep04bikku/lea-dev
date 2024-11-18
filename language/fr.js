const message = {
    //--------------------common message----------------------------//
    "header_key_value_incorrect": "Accès non autorisé à l'API, valeur invalide pour la clé API",
    "header_authorization_token_error": "Accès non autorisé à l'API, jeton d'autorisation invalide, veuillez vérifier votre demande",
    "internal_server_error":"Erreur interne du serveur",
    "required": "Le champ :attr est requis",
    "email": "Veuillez entrer un :attr valide",
    "alpha": ":attr ne contient que des caractères",
    "numeric": ":attr doit être un nombre",
    "required_if": "Le champ :attr est requis lorsque :other est :value ",
    "min": "Le champ :attr doit contenir au moins :min caractères",
    "rest_keywords_required_message": "Veuillez entrer :attr",
    "rest_keyword_somthing_went_wrong": "Quelque chose a mal tourné, veuillez réessayer plus tard",
    "rest_keyword_success": "Succès",
    "rest_keyword_no_data": "Aucune donnée trouvée",
    "rest_keyword_data_success": "Données trouvées",
    //-------------------------Auth Modules-------------------//
    "rest_keywords_unique_email_error": "Eh bien, cet e-mail est déjà utilisé",
    "rest_keywords_unique_email_exist_error": "Cet e-mail n'existe pas",
    "rest_keywords_unique_user_exist_error": "Cet utilisateur n'existe pas",
    "rest_keywords_unique_mobile_error": "Eh bien, ce mobile est déjà utilisé",
    "rest_keyword_signup_success": "Inscription réussie",
    "invalid_credential_error": "E-mail et mot de passe invalides",
    "rest_keyword_login_success": "Connexion réussie",
    "rest_keyword_logout_success": "Déconnexion réussie",
    "rest_keyword_incomplet_signUp_error": "Inscription incomplète",
    "rest_keyword_otp_verification_error": "Le numéro n'est pas vérifié",
    "rest_keyword_profile_update_success": "Votre profil a été mis à jour",
    "rest_keyword_email_otp_success": "OTP envoyé dans votre e-mail {email} avec succès",
    "rest_keyword_email_otp_verify_success": "OTP vérifié avec succès",
    "rest_keyword_email_otp_verify_error": "E-mail et OTP invalides",
    "rest_keyword_email_forget_password_link_success": "Lien de réinitialisation du mot de passe envoyé dans votre e-mail {email} avec succès",
}

module.exports = message;