const { Sequelize, Op } = require("sequelize");
const { t } = require("localizify");
const sequelize = require("../../../../models");
const _ = require('lodash');
const global = require("../../../../config/constants");
const Category = require("../../../../models/tbl_category");
const { sortingParams, pagingParams, paginate } = require("../../../../helper/helper");



const Category_Model = {

    //=========================check unique category by name==================================
    checkCategory: async (name) => {
        try {
            const category = await Category.findOne({ where: { name } });

            return category !== null;
        } catch (error) {
            console.error('Check unique category name error:', error.message, error.stack);
            throw new Error('check unique category name.');
        }
    },
    //==========================common function to add single user==============================
    addupdateCategory: async (action, request) => {
        try {
            const categoryObj = {
                name: request.name,
                image: request.image,
            }

            // console.log(action, '------------', request);

            if (action.insert) {
                const createCategoty = await Category.create(categoryObj);

                if (createCategoty && createCategoty.id) {
                    // console.log(createCategoty);
                    return createCategoty;
                }
            }

            if (action.update) {

                const updateCategoty = await Category.update(categoryObj, { where: { id: request.category_id } });

                // console.log(updateCategoty);
                return updateCategoty;
            }

            return;
        } catch (error) {
            console.error('add/update category error', error.message, error.stack);
            throw new Error('add/update category error.');
        }
    },

    //==========================add Category==============================
    addCategory: async (request) => {
        try {

            const isCategoryExist = await Category_Model.checkCategory(request.name);

            if (!isCategoryExist) {

                const CategoryData = await Category_Model.addupdateCategory({ insert: true }, request);

                if (CategoryData) {
                    return { code: global.SUCCESS, message: { keyword: 'rest_keyword_add_category_data_success', content: {} }, data: CategoryData };
                }

            } else {
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_existing_category_error', content: {} }, data: [] };
            }

        } catch (error) {
            console.error('add category error:', error.message, error.stack);
            throw new Error('add category error.');
        }
    },

    //==========================update category==============================
    updateCategory: async (request) => {
        try {
            const categoryData = await Category.findOne({ where: { id: request.id, is_deleted: false, is_active: true } });


            if (categoryData) {

                const updateObj = {
                    category_id: request.id,
                    name: request.name,
                    // image: request.image
                }

                if (request.image!== "" && request.image !== undefined) {
                    updateObj.image = request.image
                }

                if (await Category_Model.checkCategory(request.name)) {
                    if (categoryData.name === request.name) {
                        updateObj.name = categoryData.name;
                    } else {
                        return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_existing_category_error', content: {} }, data: [] };
                    }
                }

               

                 await Category_Model.addupdateCategory({ update: true }, updateObj);
            

                const result = await Category_Model.getCategory({ id: updateObj.category_id });

                if (result.data) {
                    return {
                        code: global.SUCCESS,
                        message: { keyword: 'rest_keywords_category_data_update_success', content: {} },
                        data: result.data[0],
                    };
                }
            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            console.error('update category error:', error.message, error.stack);
            throw new Error('update category error.');
        }
    },

    //==========================Delete category==============================
    deleteCategory: async (request) => {
        try {
            const deleteCategory = await Category.update({ is_deleted: true }, { where: { id: request.id } });

            return {
                code: global.SUCCESS,
                message: { keyword: 'rest_keywords_category_data_deleted_success', content: {} },
                data: {deleteCategory,id:request.id},
            };

        } catch (error) {
            console.error('delete category error:', error.message, error.stack);
            throw new Error('delete category error.');
        }
    },

    //==========================Change status of category active/blocked==============================
    changeCategoryStatus: async (request) => {
        try {
            let message = 'rest_keywords_category_data_active_status_success';

            const categoryStatus = await Category.update({ is_active: request.is_active }, { where: { id: request.id, is_deleted: false } });

            if (!request.is_active) {
                message = 'rest_keywords_category_data_blocked_status_success';
            }
            return {
                code: global.SUCCESS,
                message: { keyword: message, content: {} },
                data: {categoryStatus,id:request.id},
            };
        } catch (error) {
            console.error('change category status error:', error.message, error.stack);
            throw new Error('change category status error.');
        }
    },

    //==========================get category details==============================
    getCategory: async (request) => {
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

            if(request.role === 'user'){
                whereClause.is_active = true;
            }

            // Get Category data with id
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

            // Fetch data from Category model
            const result = await Category.findAndCountAll({
                where: whereClause,
                attributes: {}, // Specify attributes if needed
                order: _sortingParams,
                ...pagingParams_
            });
            
            return paginate(result, paging);
        } catch (error) {
            console.error('get category error:', error.message, error.stack);
            throw new Error('get category error.');
        }
    },

    //==========================get category List==============================
    categoryList: async (request) => {
        try {
            const result = await Category_Model.getCategory(request);

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
            console.error('category list error:', error.message, error.stack);
            throw new Error('category list error.');
        }
    },

}

module.exports = Category_Model