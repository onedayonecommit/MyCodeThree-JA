const Sequelize = require("sequelize");

class Item extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            
        },{})
    }
}