import {Model,DataTypes} from "sequelize"
import {ROLS,PRIORITY} from "@/share/constants"
import DateHelper from "@/share/timeHelpers"

export default class User extends Model {}

export function init(connection){
    User.init({
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        },
        rol:{
            type: DataTypes.ENUM,
            values: [...ROLS]
        },
        email: {
            type:DataTypes.STRING,
            validate:{
                isEmail:true
            },
            unique:true
        },
        dni: {
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                notNull:true,
                notEmpty:true,
                
            },
            unique:true
        },
        password:{
            type: DataTypes.STRING
        },
        confirmed:{
            type: DataTypes.BOOLEAN,
            defaultValue:false
        },
        priority: {
            type: DataTypes.STRING,
            allowNull:false,
            values:[...PRIORITY]
            
        },
        educationalInstitution:{
            type:DataTypes.STRING
        },
        createdAt:{
            type:DataTypes.DATE,
            defaultValue:DateHelper.now().value()
           
        },
        updatedAt:{
            type:DataTypes.DATE,
            set(value){
                this.setDataValue('updatedAt',DateHelper.now().value())
            }
        }
    },{
        modelName: 'user',
        sequelize: connection
    })
    
}