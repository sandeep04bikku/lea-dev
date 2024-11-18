const { Sequelize, Op } = require("sequelize");
const { t } = require("localizify");
const common = require("../../../../config/common");
const sequelize = require("../../../../models");
const moment = require("moment");
const _ = require('lodash');
const global = require("../../../../config/constants");
const { sortingParams, pagingParams, paginate } = require("../../../../helper/helper");
const AnimatedVideo = require("../../../../models/tbl_animated_video");
const Category = require("../../../../models/tbl_category");
const DiscountCode = require("../../../../models/tbl_discount_code");



const Animated_Video_Model = {

    //==========================add animated video==============================
    addAnimatedVideo: async (request) => {
        try {
            const insertData = {
                category_id: (request.category_id !== "" && request.category_id !== undefined) ? request.category_id : 0,
                discount_code_id: (request.discount_code_id !== "" && request.discount_code_id !== undefined) ? request.discount_code_id : 0,
                title: request.title,
                video_file: request.video_file,
                duration: request.duration
            }

            const animatedVideoData = await AnimatedVideo.create(insertData);

            if (animatedVideoData && animatedVideoData.id) {
                return { code: global.SUCCESS, message: { keyword: 'rest_keyword_add_animated_video_data_success', content: {} }, data: animatedVideoData };
            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            console.error('Add animated video error:', error.message, error.stack);

            throw new Error('Add Animated Video error');
        }
    },

    //==========================update animated video=============================
    updateAnimatedVideo: async (request) => {
        try {
            const animatedVideoData = await AnimatedVideo.findOne({ where: { id: request.id, is_deleted: false, is_active: true } });


            if (animatedVideoData) {
                const updateObj = {
                    category_id: (request.category_id !== "" && request.category_id !== undefined) ? request.category_id : 0,
                    discount_code_id: (request.discount_code_id !== "" && request.discount_code_id !== undefined) ? request.discount_code_id : 0,
                    title: request.title,
                    video_file: request.video_file,
                    duration: request.duration
                }

                await AnimatedVideo.update(updateObj, { where: { id: request.id } });

                const result = await Animated_Video_Model.getAnimatedVideo({ id: request.id });


                if (result.data) {
                    return {
                        code: global.SUCCESS,
                        message: { keyword: 'rest_keywords_animated_video_data_update_success', content: {} },
                        data: result.data[0],
                    };
                }
            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            console.error('Update animated video error:', error.message, error.stack);

            throw new Error('Update Animated Video error');
        }
    },

    //==========================Delete animated video==============================
    deleteAnimatedVideo: async (request) => {
        try {
            const deleteAnimatedVideo = await AnimatedVideo.update({ is_deleted: true }, { where: { id: request.id } });

            return {
                code: global.SUCCESS,
                message: { keyword: 'rest_keywords_animated_video_data_deleted_success', content: {} },
                data: { deleteAnimatedVideo, id: request.id },
            };

        } catch (error) {
            console.error('delete animated video error:', error.message, error.stack);

            throw new Error('delete Animated Video error');
        }
    },

    //==========================Change status of animated video active/blocked==============================
    changeAnimatedVideoStatus: async (request) => {
        try {
            let message = 'rest_keywords_animated_video_data_active_status_success';

            const animatedVideoStatus = await AnimatedVideo.update({ is_active: request.is_active }, { where: { id: request.id, is_deleted: false } });

            if (!request.is_active) {
                message = 'rest_keywords_animated_video_data_blocked_status_success';
            }
            return {
                code: global.SUCCESS,
                message: { keyword: message, content: {} },
                data: { animatedVideoStatus, id: request.id },
            };
        } catch (error) {
            console.error('change status animated video error:', error.message, error.stack);

            throw new Error('change status Animated Video error');
        }
    },

    //==========================get animated video details==============================
    getAnimatedVideo: async (request) => {
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
                is_deleted: false, // Default condition
            };

            if (request.role === 'user') {
                whereClause.is_active = true;
            }

            // Get Animated data with id
            if (request.id) {
                whereClause.id = request.id;
            }

            // Where clause based on filter_value
            if (filter_value === 'deleted') {
                whereClause.is_deleted = true;
            } else if (filter_value === 'active') {
                whereClause.is_deleted = false;
                whereClause.is_active = true;
            } else if (filter_value === 'inactive') {
                whereClause.is_deleted = false;
                whereClause.is_active = false;
            }

            // Add search query condition to search by name
            if (search_query) {
                whereClause.name = { [Op.like]: `%${search_query}%` };
            }

            // Fetch data from Animated video model
            const result = await AnimatedVideo.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: Category,
                        as: 'animated_video_category'
                    },
                    {
                        model: DiscountCode,
                        as: 'animated_video_discount'
                    }
                ],
                order: _sortingParams,
                ...pagingParams_
            });

            return paginate(result, paging);
        } catch (error) {
            console.error('get animated video list error:', error.message, error.stack);

            throw new Error('get Animated Video list error');
        }
    },

    //==========================get Animated video List==============================
    anmatedVideoList: async (request) => {
        try {
            const result = await Animated_Video_Model.getAnimatedVideo(request);

            if (result.data.length > 0) {
                if (request.id) {
                    return {
                        code: global.SUCCESS,
                        message: { keyword: 'rest_keyword_data_success', content: {} },
                        data: result.data[0],
                    };
                }

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
            console.error('animated video error:', error.message, error.stack);

            throw new Error('Animated Video error');
        }
    },

}

module.exports = Animated_Video_Model