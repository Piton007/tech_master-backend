import {Model,DataTypes} from "sequelize"
import DateHelper from "@/share/timeHelpers"

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
        },
        createdAt:{
            type:DataTypes.DATE,
            set(){
                this.setDataValue("createdAt",DateHelper.now().value()) 
            }
        },
        updatedAt:{
            type:DataTypes.DATE,
            set(){
                this.setDataValue('updatedAt',DateHelper.now().value())
            }
        }
        
    },{
        modelName: 'category',
        sequelize: connection
    })
}