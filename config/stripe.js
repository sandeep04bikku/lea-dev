const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

const StripePayment = {
    create_card_token: (req, callback) => {
        stripe.tokens.create({
            card: {
                name: req.name,
                number: req.number,// '4242424242424242',
                exp_month: req.exp_month,// 12,
                exp_year: req.exp_year,// 2020,
                cvc: req.cvc,//'123'
                currency: req.currency,
                address_line1: (req.address_line1 != undefined) ? req.address_line1 : ''
            }
        }, function (err, token) {
            if (!err) {
                callback(null,token);
            } else {
                callback(err,null);
            }
        });
    },

}

// module.exports = StripePayment