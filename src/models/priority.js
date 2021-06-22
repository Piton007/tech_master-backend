import {Model,DataTypes} from "sequelize"
import DateHelper from "@/share/timeHelpers"

export default class Prioridad extends Model {}

export function init(connection){
    Prioridad.init({
        label:{
            type: DataTypes.STRING,
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        sla:{
            type: DataTypes.INTEGER,
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
        modelName: 'prioridades',
        sequelize: connection
    })
}