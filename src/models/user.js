import {Model,DataTypes} from "sequelize"
import {ROLS,PRIORITY} from "@/share/constants"

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
    },{
        modelName: 'user',
        sequelize: connection
    })
    
}