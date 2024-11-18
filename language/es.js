const message = {
    //--------------------common message----------------------------//
    "header_key_value_incorrect": "Acceso no autorizado a la API, valor no válido para la clave de la API",
    "header_authorization_token_error": "Acceso no autorizado a la API, token de autorización no válido, por favor verifique su solicitud",
    "internal_server_error":"Error Interno del Servidor",
    "required": "El campo :attr es obligatorio",
    "email": "Por favor, introduzca un :attr válido",
    "alpha": ":attr solo puede contener caracteres",
    "numeric": ":attr debe ser un número",
    "required_if": "El campo :attr es obligatorio cuando :other es :value ",
    "min": "El campo :attr debe tener al menos :min caracteres",
    "rest_keywords_required_message": "Por favor, introduzca :attr",
    "rest_keyword_somthing_went_wrong": "Algo salió mal, por favor inténtelo de nuevo más tarde",
    "rest_keyword_success": "Éxito",
    "rest_keyword_no_data": "No se encontraron datos",
    "rest_keyword_data_success": "Datos encontrados",
    //-------------------------Auth Modules-------------------//
    "rest_keywords_unique_email_error": "Ey, este correo electrónico ya está siendo utilizado",
    "rest_keywords_unique_email_exist_error": "Este correo electrónico no existe",
    "rest_keywords_unique_user_exist_error": "Este usuario no existe",
    "rest_keywords_unique_mobile_error": "Ey, este móvil ya está siendo utilizado",
    "rest_keyword_signup_success": "Registro exitoso",
    "invalid_credential_error": "Correo electrónico y contraseña inválidos",
    "rest_keyword_login_success": "Inicio de sesión exitoso",
    "rest_keyword_logout_success": "Cierre de sesión exitoso",
    "rest_keyword_incomplet_signUp_error": "Registro incompleto",
    "rest_keyword_otp_verification_error": "El número no está verificado",
    "rest_keyword_profile_update_success": "Su perfil ha sido actualizado",
    "rest_keyword_email_otp_success": "OTP enviado a su correo electrónico {email} exitosamente",
    "rest_keyword_email_otp_verify_success": "OTP verificado exitosamente",
    "rest_keyword_email_otp_verify_error": "Correo electrónico y OTP inválidos",
    "rest_keyword_email_forget_password_link_success": "Enlace de restablecimiento de contraseña enviado a su correo electrónico {email} exitosamente",
}

module.exports = message;