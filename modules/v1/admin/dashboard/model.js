const { Sequelize, Op } = require("sequelize");
const common = require("../../../../config/common");
const sequelize = require("../../../../models");
const moment = require("moment");
const _ = require('lodash');
const global = require("../../../../config/constants");
const Trainer = require("../../../../models/tbl_trainer");
const User = require("../../../../models/tbl_user");
const Course = require("../../../../models/tbl_course");
const Category = require("../../../../models/tbl_category");
const Test = require("../../../../models/tbl_test");
const { sortingParams, pagingParams, paginate } = require("../../../../helper/helper");
const Country = require("../../../../models/tbl_country");
const State = require("../../../../models/tbl_state");
const City = require("../../../../models/tbl_city");
const DiscountCode = require("../../../../models/tbl_discount_code");
const CorporateProfile = require("../../../../models/tbl_corporate_profile");
const Admin = require("../../../../models/tbl_admin");
const Language = require("../../../../models/tbl_language");
const CommunityForum = require("../../../../models/tbl_community_forum");
const Blogs = require("../../../../models/tbl_blog");
const AnimatedVideo = require("../../../../models/tbl_animated_video");


const Dashboard_Model = {


    adminDashboard: async (request) => {
        try {
            console.log(request, "request data for dashboard");

            const { period, startDate, endDate } = request;

            let dateRange = {};
            let applyDateFilter = false;

            switch (period) {
                case 'day':
                    dateRange = {
                        [Op.gte]: moment().startOf('day').toDate(),
                        [Op.lt]: moment().endOf('day').toDate()
                    };
                    applyDateFilter = true;
                    break;
                case 'week':
                    dateRange = {
                        [Op.gte]: moment().startOf('week').toDate(),
                        [Op.lt]: moment().endOf('week').toDate()
                    };
                    applyDateFilter = true;
                    break;
                case 'month':
                    dateRange = {
                        [Op.gte]: moment().startOf('month').toDate(),
                        [Op.lt]: moment().endOf('month').toDate()
                    };
                    applyDateFilter = true;
                    break;
                case 'year':
                    dateRange = {
                        [Op.gte]: moment().startOf('year').toDate(),
                        [Op.lt]: moment().endOf('year').toDate()
                    };
                    applyDateFilter = true;
                    break;
                case 'custom':
                    if (startDate && endDate) {
                        dateRange = {
                            [Op.gte]: new Date(startDate),
                            [Op.lt]: new Date(endDate)
                        };
                        applyDateFilter = true;
                    }
                    // If startDate and endDate are not provided, skip filtering
                    break;
                default:
                    // No date filter applied if period is not recognized
                    break;
            }

            // Apply date filtering only if applyDateFilter is true
            const dateFilter = applyDateFilter ? { createdAt: dateRange } : {};

            const countData = {
                user_count: await User.count({ where: { is_deleted: false, ...dateFilter } }),
                trainer_count: await Trainer.count({ where: { is_deleted: false, ...dateFilter } }),
                course_count: await Course.count({ where: { is_deleted: false, ...dateFilter } }),
                category_count: await Category.count({ where: { is_deleted: false, ...dateFilter } }),
                test_count: await Test.count({ where: { is_deleted: false, ...dateFilter } }),
                discount_code_count: await DiscountCode.count({ where: { is_deleted: false, ...dateFilter } }),
                corporate_profile_count: await CorporateProfile.count({ where: { is_deleted: false, ...dateFilter } }),
                subadmin_count: await Admin.count({ where: { is_deleted: false, role: 'subadmin', ...dateFilter } }),
                language_count: await Language.count({ where: { is_deleted: false, ...dateFilter } }),
                community_forum_count: await CommunityForum.count({ where: { is_deleted: false, ...dateFilter } }),
                blog_count: await Blogs.count({ where: { is_deleted: false, ...dateFilter } }),
                animated_video_count: await AnimatedVideo.count({ where: { is_deleted: false, ...dateFilter } }),
            };

            return { code: global.SUCCESS, message: { keyword: 'rest_keyword_data_success', content: {} }, data: countData };
        } catch (error) {
            throw error;
        }
    },

    //==========================get country details==============================
    getCountry: async (request) => {
        try {
            console.log(request, "country req");

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

            // Get Category data with id
            if (request.id) {
                whereClause.id = request.id;
            }



            // Fetch data from Category model
            const result = await Country.findAndCountAll({
                where: whereClause,
                attributes: {}, // Specify attributes if needed
                order: _sortingParams,
                ...pagingParams_
            });

            return paginate(result, paging);
        } catch (error) {
            throw error; // Handle the error as per your application's needs
        }
    },

    //==========================get country List==============================
    countryList: async (request) => {
        try {
            const result = await Dashboard_Model.getCountry(request);

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

    //==========================get city details==============================
    getCity: async (request) => {
        try {

            const page = (request.page !== "" && request.page !== undefined) ? request.page : 1;
            const limit = (request.limit !== "" && request.limit !== undefined) ? request.limit : 10;
            const sort = (request.sort !== "" && request.sort !== undefined) ? request.sort : 'id:desc';

            const paging = { page, limit };
            const _sortingParams = !_.isEmpty(sort) ? sortingParams(sort) : null;
            const pagingParams_ = pagingParams(paging);

            const whereClause = {
                is_deleted: false, // Default condition
                country_id: request.country_id,
            };

            if (request.role === 'user') {
                whereClause.is_active = true;
            }

            // Get Category data with id
            if (request.id) {
                whereClause.id = request.id;
            }

            const result = await State.findAndCountAll({
                where: whereClause,
                attributes: ['id', 'name'], // Specify attributes if needed
                order: _sortingParams,
                include: [{
                    model: City,
                    as: 'cities',
                    where: { is_deleted: false },
                    required: false,
                    attributes: ['id', 'name', 'state_id'] // Specify city attributes
                }],
                // Pagination for states is removed as we will paginate cities directly
            });

            // Collect all cities into a single array
            let cities = result.rows.reduce((acc, state) => {
                if (state.cities) {
                    acc.push(...state.cities);
                }
                return acc;
            }, []);

            // cities = _.sortBy(cities, 'name');

            // Paginate the cities array
            const paginatedCities = await Dashboard_Model.paginateArray(cities, page, limit);

            return paginatedCities;

            // return paginate(result, paging);
        } catch (error) {
            throw error; // Handle the error as per your application's needs
        }
    },

    // Utility function to paginate an array (example implementation)
    paginateArray: async (array, page, limit) => {
        const offset = (page - 1) * limit;
        const paginatedItems = array.slice(offset, offset + limit);
        return {
            totalRecords: array.length,
            totalPages: Math.ceil(array.length / limit),
            currentPage: page,
            data: paginatedItems
        };
    },

    //==========================get city List==============================
    cityList: async (request) => {
        try {
            const result = await Dashboard_Model.getCity(request);

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

module.exports = Dashboard_Model