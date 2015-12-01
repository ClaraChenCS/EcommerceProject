/**
 * Created by Carlos on 11/4/15.
 */
/* Object/Relational mapping for instances of the Users class.
 - classes correspond to tables
 - instances correspond to rows
 - fields correspond to columns
 In other words, this code defines how a row in the postgres order table
 maps to the JS Order object.
 */
module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Order", {
        userID:{type: DataTypes.INTEGER, allowNull: false},
        date: {type: DataTypes.DATE, allowNull: false},
        totalprice: {type: DataTypes.DECIMAL(10,2), allowNull: true},
        checkout: {type: DataTypes.BOOLEAN, allowNull: false}
    },
        {
            classMethods: {
                /* Testing */
                createOrderWithProduct: function (req, callback) {
                    var _Order = this;

                    var newOrder = _Order.build({
                        userID: req.user.id,
                        date: new Date(),
                        checkout: false
                    });

                    newOrder.save().then(function (savedOrder) {

                        var newOrderProduct = global.db.Orderproduct.build({
                            qty: req.body.qty,
                            productID: req.params.id,
                            orderID: savedOrder.id
                        });

                        newOrderProduct.save().then(function(orderProduct){

                            callback(orderProduct);

                        }).error(function (error) {

                            // Do something with error
                            console.log("Error!, we must do something: 'order.js, line 45");

                        });

                    }).error(function (error) {

                        // Do something with error
                        console.log("Error!, we must do something: 'order.js, line 52");

                    });
                },

                pendingOrderForUser: function (req, callback){
                    var _Order = this;
                    var loggedUserID;  // Variable used to Try/Catch if the property user is set on the req variable.

                    // Verify if an user is logged using Try/Catch - If not set user id to "0"
                    try {
                        loggedUserID = req.user.id;
                    }
                    catch (error) {
                        loggedUserID = 0;
                    }

                    _Order.findOne({
                        where: {
                            userID: loggedUserID,
                            checkout: false
                        }
                    }).then(function(order) {
                        // return order
                        callback (order, loggedUserID);
                    }).error(function (error) {
                        // Do something with error
                        console.log("Error!, we must do something: 'order.js, line 68");

                    });
                },

                /*Testing for orderstatus */
                getOrderByUserID: function(req, callback){
                    var _Order= this;
                    var loggedUserID; // Variable used to Try/Catch if the property user is set on the req variable.

                    // Verify if an user is logged using Try/Catch - If not set user id to "0"
                    try {
                        loggedUserID = req.user.id;
                    }
                    catch (error) {
                        loggedUserID = 0;
                    }

                    _Order.findAll({
                         where: {
                             userID: loggedUserID,
                             checkout: true   /// this indicates the order were placed.
                         }
                    }). then(function(order){
                        //return order
                        callback (order, loggedUserID);
                    }).error(function (error) {
                        //Do something with error
                        console.log("Error!, we must do something: 'order.js, line 107");
                    });


                }

            }
        });
};


