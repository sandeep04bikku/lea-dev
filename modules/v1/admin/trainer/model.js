const { Sequelize, Op } = require("sequelize");
const { t } = require("localizify");
const common = require("../../../../config/common");
const sequelize = require("../../../../models");
const moment = require("moment");
const _ = require('lodash');
const email_template = require("../../../../config/template")
const enc_dec = require("../../../../middleware/encriptionDecription");
const global = require("../../../../config/constants");
const Trainer = require("../../../../models/tbl_trainer");
const TrainerEducation = require("../../../../models/tbl_trainer_education");
const TrainerCertification = require("../../../../models/tbl_trainer_certification");
const DeviceInfo = require("../../../../models/tbl_device_info");
const { sortingParams, pagingParams, paginate } = require("../../../../helper/helper");
const TrainerReview = require("../../../../models/tbl_trainer_review");
const User = require("../../../../models/tbl_user");



const Trainer_Model = {

    //================check unique email====================
    checkEmail: async (email) => {
        try {
            const user = await Trainer.findOne({ where: { email } });
            if (user) {
                return true;
            } else {
                return false
            }

        } catch (error) {
            // console.error('Error retrieving user by email:', error);
            throw error;
        }
    },

    //=====================check unique mobile number=====================
    checkMobile: async (phone_number, country_code) => {
        try {
            const user = await Trainer.findOne({ where: { phone_number, country_code } });
            if (user) {
                return true;
            } else {
                return false
            }

        } catch (error) {
            // console.error('Error retrieving user by email:', error);
            throw error;
        }
    },

    //==========================add single Trainer data==============================
    addTrainerDetails: async (request) => {
        try {
            const trainerObj = {
                login_type: 'S',
                full_name: request.full_name,
                email: request.email,
                country_code: request.country_code,
                phone_number: request.phone_number,
                password: await enc_dec.encryptPlain(request.password),
                role: 'trainer',
                is_temp_password: true
            }

            const trainerData = await Trainer.create(trainerObj);

            if (trainerData && trainerData.id) {
                const template = await email_template.trainerLoginCredential(trainerData.email, request.password);
                const isSend = await common.sendEmail("Login Credential", trainerData.email, template);

                if (isSend) {
                    // Fetch the trainer data again to exclude the password field
                    const createdTrainer = await Trainer.findByPk(trainerData.id, {
                        attributes: { exclude: ['password'] }
                    });
                    return createdTrainer;
                }

                return;
            }

            return;

        } catch (error) {
            throw error;
        }
    },

    //==========================add Trainer Education==============================
    trainerEducation: async (requests, id) => {
        try {
            for (const request of requests) {

                const _id = (request.id !== "" && request.id !== undefined) ? request.id : 0
                const isExist = await TrainerEducation.findOne({ where: { id: _id } });
                if (!isExist) {
                    const educationObj = {
                        trainer_id: id,
                        name: request.name,
                        marks_in_percentage: request.marks_in_percentage,
                        university: request.university,
                        certificate_image: request.certificate_image
                    };

                    await TrainerEducation.create(educationObj);
                } else {
                    const updateObj = {
                        name: request.name,
                        marks_in_percentage: request.marks_in_percentage,
                        university: request.university,
                        // certificate_image: request.certificate_image
                    }

                    if (request.certificate_image !== "" && request.certificate_image !== undefined) {
                        updateObj.certificate_image = request.certificate_image
                    }
                    await TrainerEducation.update(updateObj, { where: { id: request.id } })
                }

            }

            // Fetch and return all education details for the specific trainer
            const trainerId = id;
            const trainerEducationDetails = await TrainerEducation.findAll({
                where: { trainer_id: trainerId }
            });

            // console.log(trainerEducationDetails, "education");

            return trainerEducationDetails;
        } catch (error) {
            throw error;
        }
    },

    //==========================add trainer Certification==============================
    trainerCertification: async (requests, id) => {
        try {
            for (const request of requests) {
                const _id = (request.id !== "" && request.id !== undefined) ? request.id : 0
                const isExist = await TrainerCertification.findOne({ where: { id: _id } });

                if (!isExist) {
                    const certificationObj = {
                        trainer_id: id,
                        name: request.name,
                        institution: request.institution,
                        certificate_image: request.certificate_image
                    };
                    await TrainerCertification.create(certificationObj);
                } else {
                    const updateObj = {
                        name: request.name,
                        institution: request.institution,
                        // certificate_image: request.certificate_image
                    }

                    if (request.certificate_image !== "" && request.certificate_image !== undefined) {
                        updateObj.certificate_image = request.certificate_image
                    }

                    await TrainerCertification.update(updateObj, { where: { id: request.id } })
                }

            }

            // Fetch and return all education details for the specific trainer
            const trainerId = id;
            const trainerCertificationDetails = await TrainerCertification.findAll({
                where: { trainer_id: trainerId }
            });
            // console.log(trainerCertificationDetails, "certification");
            return trainerCertificationDetails;
        } catch (error) {
            throw error;
        }
    },

    // updateCertificationEducation: async (requests) => {
    //     try {
    //         if (requests.certification_data) {
    //             for (const request of requests) {
    //                 const _id = (request.id !== "" && request.id !== undefined) ? request.id : 0
    //                 const isExist = await TrainerCertification.findOne({ where: { id: _id } });
    //                 if (isExist) {

    //                 } else {

    //                     await Trainer_Model.addTrainerCertification(request, id)
    //                 }

    //             }
    //         }

    //         if (requests.education_data) {
    //             for (const request of requests) {
    //                 const id = (request.id !== "" && request.id !== undefined) ? request.id : 0
    //                 const isExist = await TrainerEducation.findOne({ where: { id: id } });
    //                 if (isExist) {

    //                 } else {
    //                     await Trainer_Model.addTrainerEducation(request, trainer_id);
    //                 }

    //             }
    //         }

    //     } catch (error) {
    //         throw error
    //     }
    // },


    //==========================add bulk Trainer==============================
    AddBulkTrainer: async (requests) => {
        try {
            // console.log(requests);
            const successfulInsertions = [];
            const errors = [];

            for (const request of requests.trainers_data) {
                const isEmailExisting = await Trainer_Model.checkEmail(request.email);
                const isMobileExisting = await Trainer_Model.checkMobile(request.phone_number, request.country_code);

                if (!isEmailExisting && !isMobileExisting) {
                    const trainerData = await Trainer_Model.addTrainerDetails(request);
                    if (trainerData) {
                        successfulInsertions.push(trainerData);
                    }
                } else {
                    if (isEmailExisting) {
                        errors.push({ request, error: t('rest_keywords_unique_email_error') });
                    }
                    if (isMobileExisting) {
                        errors.push({ request, error: t('rest_keywords_unique_mobile_error') });
                    }
                }

            }

            if (successfulInsertions.length > 0) {
                return {
                    code: global.SUCCESS,
                    message: { keyword: 'rest_keyword_add_trainer_data_success', content: {} },
                    data: { successfulInsertions, errors },
                    // errors: errors
                };
            } else {
                return {
                    code: global.OPRETION_FAILD,
                    message: { keyword: 'rest_keywords_no_valid_data', content: {} },
                    data: errors,
                    // errors: errors
                };
            }
        } catch (error) {
            throw error;
        }
    },

    //==========================add single Trainer==============================
    addSingleTrainer: async (request) => {
        try {
            const isEmailExisting = await Trainer_Model.checkEmail(request.email);
            const isMobleExisting = await Trainer_Model.checkMobile(request.phone_number, request.country_code,)

            if (!isEmailExisting) {
                if (!isMobleExisting) {

                    const trainerData = await Trainer_Model.addTrainerDetails(request);
                    // console.log(trainerData.id,'----------------',trainerData);
                    const data = { trainerData }
                    if (trainerData) {
                        if (request.education_data) {

                            const education_details = await Trainer_Model.trainerEducation(request.education_data, trainerData.id);
                            data.education_details = education_details
                        }

                        if (request.certification_data) {

                            const certification_details = await Trainer_Model.trainerCertification(request.certification_data, trainerData.id);
                            data.certification_details = certification_details
                        }

                        return { code: global.SUCCESS, message: { keyword: 'rest_keyword_add_trainer_data_success', content: {} }, data: data };
                    }

                } else {
                    return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_mobile_error', content: {} }, data: [] };
                }
            } else {
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_email_error', content: {} }, data: [] };
            }

        } catch (error) {
            throw error
        }
    },

    //==========================Delete single trainer==============================
    deleteTrainer: async (request) => {
        try {
            // console.log(request);
            const deleteTrainer = await Trainer.update({ is_deleted: true }, { where: { id: request.id } });

            return {
                code: global.SUCCESS,
                message: { keyword: 'rest_keywords_trainer_data_deleted_success', content: deleteTrainer },
                data: { deleteTrainer, id: request.id },
            };

        } catch (error) {
            throw error;
        }
    },

    //==========================Change status of single trainer==============================
    changeTrainerStatus: async (request) => {
        try {
            let message = 'rest_keywords_trainer_data_active_status_success';

            const trainerStatus = await Trainer.update({ is_active: request.is_active }, { where: { id: request.id, is_deleted: false } });

            if (!request.is_active) {
                message = 'rest_keywords_trainer_data_blocked_status_success';
            }
            return {
                code: global.SUCCESS,
                message: { keyword: message, content: {} },
                data: { trainerStatus, id: request.id },
            };
        } catch (error) {
            throw error
        }
    },

    //==========================Get trainer Details==============================
    getTrainer: async (request) => {
        try {

            const search_query = request.search || '';
            const filter_value = request.filter || '';

            const page = (request.page !== "" && request.page !== undefined) ? request.page : 1;
            const limit = (request.limit !== "" && request.limit !== undefined) ? request.limit : 10;
            const sort = (request.sort !== "" && request.sort !== undefined) ? request.sort : 'id:desc';

            const paging = { page: page, limit: limit }

            const _sortingParams = !_.isEmpty(sort) ? sortingParams(sort) : null;
            const pagingParams_ = pagingParams(paging);

            const whereClause = {
                is_deleted: false,
            };

            //get trainer data with id
            if (request.id) {
                whereClause.id = request.id;
            }

            // where clause based on filterValue
            if (filter_value === 'deleted') {
                whereClause.is_deleted = true;
            } else if (filter_value === 'active') {
                whereClause.is_deleted = false;
                whereClause.is_active = true;
            } else if (filter_value === 'inactive') {
                whereClause.is_deleted = false;
                whereClause.is_active = false;
            }

            if (search_query) {
                whereClause[Op.or] = [
                    { email: { [Op.like]: `%${search_query}%` } },
                    { full_name: { [Op.like]: `%${search_query}%` } },
                    sequelize.literal(`CONCAT(country_code, phone_number) LIKE '%${search_query}%'`)
                ];
            }


            const result = await Trainer.findAndCountAll({
                where: whereClause,
                attributes: {
                    exclude: ['password'],
                },
                include: [
                    {
                        model: DeviceInfo,
                        required: false,
                        attributes: {
                            exclude: ['token', 'device_token']
                        },
                        as: 'trainer_device_info',
                        where: {
                            role: 'trainer'
                        }
                    },
                    {
                        model: TrainerEducation,
                        as: 'trainer_education',
                    },
                    {
                        model: TrainerCertification,
                        as: 'trainer_certification',
                    }
                ],
                distinct:true,
                order: _sortingParams,
                ...pagingParams_
            });


            return paginate(result, paging);

        } catch (error) {
            throw error;
        }
    },

    //==========================Update Trainer Details==============================
    updateTrainer: async (request) => {
        try {

            const trainerData = await Trainer.findOne({ where: { id: request.id, is_deleted: false, is_active: true } });

            if (trainerData) {

                const updateObj = {
                    full_name: request.full_name,
                    email: request.email,
                    country_code: request.country_code,
                    phone_number: request.phone_number,
                    // image: (request.image !== "" && request.image !== undefined) ? request.image : trainerData.image
                }

                if (request.image !== "" && request.image !== undefined) {
                    updateObj.image = request.image
                }

                if (await Trainer_Model.checkEmail(request.email)) {

                    if (request.email === trainerData.email) {

                        updateObj.email = trainerData.email;
                    } else {
                        return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_email_error', content: {} }, data: [] };
                    }
                }

                if (await Trainer_Model.checkMobile(request.phone_number, request.country_code)) {

                    if (request.country_code === trainerData.country_code && request.phone_number === trainerData.phone_number) {

                        updateObj.country_code = trainerData.country_code;
                        updateObj.phone_number = trainerData.phone_number;
                    } else {
                        return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_mobile_error', content: {} }, data: [] };
                    }
                }

                await Trainer.update(updateObj, { where: { id: request.id } });

                if (request.education_data) {

                    const education_details = await Trainer_Model.trainerEducation(request.education_data, request.id);
                    // data.education_details = education_details
                }

                if (request.certification_data) {

                    const certification_details = await Trainer_Model.trainerCertification(request.certification_data, request.id);
                    // data.certification_details = certification_details
                }

                const result = await Trainer_Model.getTrainer({ id: request.id });

                if (result.data) {
                    return {
                        code: global.SUCCESS,
                        message: { keyword: 'rest_keywords_trainer_data_update_success', content: {} },
                        data: result.data[0],
                    };
                }


            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            throw error;
        }
    },

    //==========================Get Trainers List==============================
    trainerList: async (request) => {
        try {
            console.log(request,"trainer request");
            
            const result = await Trainer_Model.getTrainer(request);

            if (result.data.length > 0) {
                return {
                    code: global.SUCCESS,
                    message: { keyword: 'rest_keyword_data_success', content: {} },
                    data: result,
                };
            } else {
                return {
                    code: global.NO_DATA_FOUND,
                    message: { keyword: 'rest_keyword_no_data', content: {} },
                    data: result,
                };
            }

        } catch (error) {
            throw error;
        }
    },

    getTrainerReview: async (request) => {
        try {

            const page = (request.page !== "" && request.page !== undefined) ? request.page : 1;
            const limit = (request.limit !== "" && request.limit !== undefined) ? request.limit : 10;
            const sort = (request.sort !== "" && request.sort !== undefined) ? request.sort : 'id:desc';

            const paging = { page: page, limit: limit };

            const _sortingParams = !_.isEmpty(sort) ? sortingParams(sort) : null;
            const pagingParams_ = pagingParams(paging);

            const whereClause = {
                is_deleted: false,
            };

            if (request.trainer_id) {
                whereClause.trainer_id = request.trainer_id;
            }


            const result = await TrainerReview.findAndCountAll({
                where: whereClause,
                attributes: {},
                include: [
                    {
                        model: User,
                        attributes: ['id', 'full_name', 'image'],
                        as: "user_trainer_review",
                        where: {
                            is_deleted: false,
                            is_active: true
                        }
                    }
                ],
                order: _sortingParams,
                ...pagingParams_,
            });

            return paginate(result, paging);
        } catch (error) {
            throw error;
        }
    },

    trainerReviewList: async (request) => {
        try {
            const result = await Trainer_Model.getTrainerReview(request);

            // console.log(result);

            if (result.data.length > 0) {
                return {
                    code: global.SUCCESS,
                    message: { keyword: 'rest_keyword_data_success', content: {} },
                    data: result,
                };
            } else {
                return {
                    code: global.NO_DATA_FOUND,
                    message: { keyword: 'rest_keyword_no_data', content: {} },
                    data: result,
                };
            }

        } catch (error) {
            throw error;
        }
    },



}

module.exports = Trainer_Model