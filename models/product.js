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
    return sequelize.define("Product", {
            productname: {type: DataTypes.STRING, allowNull: false},
            country: {type: DataTypes.STRING, allowNull: false},
            qty: {type: DataTypes.INTEGER, allowNull: false},
            price: {type: DataTypes.DECIMAL(10, 2), allowNull: false},
            type: {type: DataTypes.STRING, allowNull: false},
            expiration: {type: DataTypes.DATE, allowNull: false}
        },
        {
            classMethods: {

                associate: function(models) {
                    Product.hasOne(models.Manufacturer)
                    Product.hasMany(models.Orderproduct)
                    Product.hasMany(models.Image)
                },

                saveProduct: function(req, callback){
                    var _Product = this;

                    var newProduct = _Product.build({
                        productname: req.body.productname,
                        country: req.body.country,
                        qty: req.body.qty,
                        price: req.body.price,
                        type: req.body.type,
                        expiration: req.body.expiration
                    });

                    newProduct.save().then(function (savedData) {
                        console.log("New Product Saved to Database");
                        var error = null;
                        callback(savedData,error);
                    }).error(function(error) {
                        var responserMsg = "Error Storing Rates Info";
                        console.log(responserMsg+": "+error);
                        callback(responserMsg,error);
                    });
                },


                deleteProduct: function(req, callback){
                    var _Product = this;

                    _Product.destroy({where:{id: req.body.productid}}).then(function(error,result){
                        if(error == '0'){
                            console.log("Error destroying the object");
                            callback("Error");

                        } else {
                            console.log("Success deleting object");
                            callback("Success");

                        }


                    });
                },

                //write some code to retrieve data from DB
                //this is for testing
                showOrder: function(req, callback) {
                    var _Product = this;
                    _Product.findAll().then(function(tasks) {
                        // project will be an instance of Project and stores the content of the table entry
                        // with id 123. if such an entry is not defined you will get null
                        if (error) {
                            console.log("Error retrieving the object");
                            callback("Error");
                        } else {
                            console.log("Sccess retrieving object");
                            callback(tasks);
                        }
                    });
                }
            }

        });
};