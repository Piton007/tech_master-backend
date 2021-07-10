import {Model,DataTypes} from "sequelize"
import DateHelper from "@/share/timeHelpers"

export default class Blog extends Model {}

export function init(connection){
    Blog.init({
        title: {
            type: DataTypes.STRING,
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        content: {
            type: DataTypes.TEXT('long') ,
            allowNull:false,
            validate:{
                notEmpty:true
            }
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
        modelName: 'blogs',
        sequelize: connection
    })
}