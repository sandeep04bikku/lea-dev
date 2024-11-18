const _ = require('lodash');

exports.sortingParams = (params) => {
    return _.split(params, ",").map(item => _.split(item, ":"));
}

exports.pagingParams = (params) => {
    const { page, limit } = params;
    return {
        offset: Number(page) < 1 ? 0 : (Number(page) - 1) * Number(limit),
        limit: Number(limit)
    };
}

exports.paginate = (resultset, params) => {
    const { rows, count } = resultset;
    const { page, limit } = params;
    return {
        paging: {
            total: count,
            page_no: Number(page) < 1 ? 1 : Number(page),
            page_length: rows.length,
            page_limit: Number(limit)
        },
        data: rows
    };
}