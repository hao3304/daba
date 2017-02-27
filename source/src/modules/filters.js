/**
 * Created by jack on 16/11/25.
 */

/*性别*/
export const Gender = function(v){
    switch(parseInt(v)){
        case 0:{
            return '女';
        }break;
        case 1:{
            return '男'
        }break;
    }
}

/**
 * 处理状态
 * @param v
 * @returns {*}
 * @constructor
 */
export const Status = function(v){
    switch(parseInt(v)){
        case 1:{
            return '未联系';
        }break;
        case 2:{
            return '处理中'
        }break;
        case 3:{
            return '已处理'
        }break;
    }
}