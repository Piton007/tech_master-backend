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
        categoria: {
            type: DataTypes.STRING,
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        subcategoria:{
            type: DataTypes.STRING
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
        modelName: 'categorias',
        sequelize: connection
    })
}