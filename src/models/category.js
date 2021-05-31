import {Model,DataTypes} from "sequelize"

export default class Category extends Model {}

export function init(connection){
    Category.init({
        servicio: {
            type: DataTypes.STRING,
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        categoria_1: {
            type: DataTypes.STRING
        },
        categoria_2:{
            type: DataTypes.STRING
        },
        categoria_3: {
            type:DataTypes.STRING,
        },
        tipo:{
            type: DataTypes.STRING,
            values:["incidente","requerimiento"]
        }
        
    },{
        modelName: 'category',
        sequelize: connection
    })
}