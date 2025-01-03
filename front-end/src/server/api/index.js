const { connection } = require('../mysql/mysql')
const { getDate } = require('../utils/index')
//登录注册
const register = (user_name, password, role) => {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO user_info (user_name,password,role) VALUES ('${user_name}' , '${password}','${role}' );`, (err, result, yield) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
const login = (user_name, password) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM user_info WHERE user_name='${user_name}' AND password='${password}';`, (err, result, yield) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
//个人信息
const updateUserInfo = (user_name, password, telephone, address, user_id) => {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE user_info SET user_name='${user_name}',password='${password}',telephone='${telephone}',address='${address}' 
        WHERE user_id=${user_id};`, (err, result, yield) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
//用户信息
const getUserList = (searchValue) => {
    const sql = searchValue ?
        `SELECT user_id,user_name,password,role,telephone,address FROM user_info WHERE user_name LIKE '%${searchValue}' OR user_name LIKE '${searchValue}%' OR user_name LIKE '%${searchValue}%';`
        : `SELECT user_id,user_name,password,role,telephone,address FROM user_info;`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result, yield) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
//删除用户信息
const deleteUser = (user_id) => {
    const sql = `SET FOREIGN_KEY_CHECKS=0;DELETE FROM user_info WHERE user_id=${user_id};SET FOREIGN_KEY_CHECKS=1;`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result, yield) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
//修改用户信息
const updateUser = (user_name, password, role, telephone, address, user_id) => {
    const sql = `UPDATE user_info SET user_name='${user_name}',password='${password}',role='${role}',telephone='${telephone}',address='${address}' WHERE user_id=${user_id};`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result, yield) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
//药品信息
const getDrugList = (searchValue = '') => {
    const sql = searchValue ?
        (isNaN(searchValue) ? `SELECT * FROM drug_info WHERE (drug_name LIKE '${searchValue}%') OR (drug_name LIKE '%${searchValue}') OR (drug_name LIKE '%${searchValue}%');` :
            `SELECT * FROM drug_info WHERE drug_id = ${searchValue};`)
        : 'SELECT * FROM drug_info;'
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result, yield) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
//添加药品信息
const addDrug = (img, drug_name, drug_description, manufacturer, unit, specification, stock_lower_limit, stock_upper_limit, price) => {
    var imgtemp = "https://www.freeimg.cn/i/2023/12/23/65866f549d9da.jpg"
    let sql
    if (!img) {
        sql = `INSERT INTO drug_info (drug_name, drug_description, manufacturer, unit, specification, stock_lower_limit, stock_upper_limit, price,img) VALUES ('${drug_name}','${drug_description}','${manufacturer}','${unit}','${specification}',${stock_lower_limit},${stock_upper_limit},${price},"${imgtemp}");
        `
    }
    else {
        sql = `INSERT INTO drug_info (drug_name, drug_description, manufacturer, unit, specification, stock_lower_limit, stock_upper_limit, price,img) VALUES ('${drug_name}','${drug_description}','${manufacturer}','${unit}','${specification}',${stock_lower_limit},${stock_upper_limit},${price},"${img}");
        `
    }
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result, yield) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
//查询药品最大值
const getMax = (drag_id) => {
    const sql = `
    SELECT SUM(stock_info.remaining_quantity) FROM stock_info WHERE drug_id=${drag_id};
    SELECT stock_upper_limit FROM drug_info WHERE drug_id=${drag_id};
    `
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result, yield) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
//查询药品最大值
const getValue = (drug_id) => {
    const sql = `SELECT SUM(stock_info.remaining_quantity) FROM stock_info WHERE drug_id=${drug_id};`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result, yield) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
//删除药品信息
const deleteDrug = (drug_id) => {
    const sql = `SET FOREIGN_KEY_CHECKS=0;DELETE FROM drug_info WHERE drug_id=${drug_id};SET FOREIGN_KEY_CHECKS=1;DELETE FROM stock_info WHERE drug_id=${drug_id};`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result, yield) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
//修改药品信息
const repairDrug = (img, stock_lower_limit, stock_upper_limit, price, drug_description, drug_id) => {
    const sql = `UPDATE drug_info SET img='${img}',stock_lower_limit=${stock_lower_limit},stock_upper_limit=${stock_upper_limit},price=${price},drug_description='${drug_description}' WHERE drug_id =${drug_id}`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result, yield) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

//进货
const jinhuo = (drug_id, batch_number, production_date, purchase_unit_price, remaining_quantity, user_id, note, purchase_date = getDate(),) => {
    const purchase_total_amount = purchase_unit_price * remaining_quantity
    const sql = `INSERT INTO purchase_order (user_id,purchase_date,purchase_total_amount,note) VALUES (${user_id},'${purchase_date}',${purchase_total_amount},'${note}');
    INSERT INTO stock_info (drug_id, batch_number, production_date, purchase_date, purchase_unit_price, remaining_quantity) VALUES (${drug_id},'${batch_number}','${production_date.split('T')[0]}','${purchase_date}',${purchase_unit_price},${remaining_quantity});
    `
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result, yield) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
//购买药品
async function executeQuery(sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
const process = async (sales_quantity, drug_id) => {
    //减库存
    let remaining_to_reduce = sales_quantity
    while (remaining_to_reduce > 0) {
        const sql = `SET @remaining_to_reduce = ${remaining_to_reduce};SELECT remaining_quantity INTO @temp FROM stock_info WHERE drug_id = ${drug_id} ORDER BY production_date LIMIT 1;UPDATE stock_info SET remaining_quantity = CASE WHEN remaining_quantity >= @remaining_to_reduce THEN remaining_quantity - @remaining_to_reduce ELSE 0 END WHERE drug_id = ${drug_id} ORDER BY production_date LIMIT 1; SET @remaining_to_reduce = CASE WHEN @remaining_to_reduce >= @temp THEN @remaining_to_reduce - @temp ELSE 0 END;SET foreign_key_checks = 0;DELETE FROM stock_info WHERE remaining_quantity = 0 AND drug_id = ${drug_id} LIMIT 1;SET foreign_key_checks = 1;SELECT @remaining_to_reduce;`
        const result = await executeQuery(sql);
        remaining_to_reduce = result[result.length - 1][0]['@remaining_to_reduce'];
    }

}
const buyDrug = (drug_id, user_id, sales_quantity, sales_unit_price) => {
    const judgesql = `SELECT SUM(remaining_quantity) AS total_quantity FROM stock_info WHERE drug_id = ${drug_id};`
    return new Promise((resolve, reject) => {
        connection.query(judgesql, (err, result, yield) => {
            if (err) {
                reject(err)
            } else {
                if (result[0]['total_quantity'] < sales_quantity) {
                    resolve(false)
                } else {
                    const updatesql = `INSERT INTO sales_info (drug_id, user_id, sales_date, sales_quantity, sales_unit_price, sales_amount) VALUES (${drug_id},${user_id},'${getDate()}',${sales_quantity},${sales_unit_price},${sales_unit_price * sales_quantity});`
                    connection.query(updatesql, (err, result, yield) => {
                        if (err) {
                            reject(err)
                        } else {
                            process(sales_quantity, drug_id)
                            resolve(result)
                        }
                    })
                }
            }
        })
    });
}
//库存信息
const getKucun = (searchValue) => {
    const sql = searchValue ?
        (isNaN(searchValue) ? `SELECT s.stock_id, s.drug_id, d.drug_name, s.batch_number, s.production_date, s.purchase_date, s.purchase_unit_price, s.remaining_quantity FROM stock_info AS s JOIN drug_info AS d WHERE d.drug_id IN (s.drug_id) AND
    s.drug_id IN (SELECT drug_id FROM drug_info WHERE (drug_name LIKE '${searchValue}%') OR (drug_name LIKE '%${searchValue}') OR (drug_name LIKE '%${searchValue}%'))` :
            `SELECT s.stock_id, s.drug_id, d.drug_name, s.batch_number, s.production_date, s.purchase_date, s.purchase_unit_price, s.remaining_quantity
    FROM stock_info AS s JOIN drug_info AS d WHERE d.drug_id IN (s.drug_id) AND s.stock_id=${searchValue};`)
        : 'SELECT s.stock_id, s.drug_id, d.drug_name, s.batch_number, s.production_date, s.purchase_date, s.purchase_unit_price, s.remaining_quantity FROM stock_info AS s JOIN drug_info AS d WHERE d.drug_id IN (s.drug_id);'
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result, yield) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
//销售信息
const getXiaoshou = (searchValue) => {
    const sql = searchValue ?
        (isNaN(searchValue) ? `SELECT s.sales_id, d.drug_name, u.user_name, s.sales_date, s.sales_quantity, s.sales_unit_price, s.sales_amount FROM sales_info AS s JOIN drug_info AS d JOIN user_info AS u WHERE d.drug_id IN (s.drug_id) AND u.user_id IN (s.user_id) AND (u.user_name LIKE '%${searchValue}' OR u.user_name LIKE '${searchValue}%' OR u.user_name LIKE '%${searchValue}%' OR d.drug_name LIKE '%${searchValue}' OR d.drug_name LIKE '${searchValue}%' OR d.drug_name LIKE '%${searchValue}%');
    `:
            `SELECT s.sales_id, d.drug_name, u.user_name, s.sales_date, s.sales_quantity, s.sales_unit_price, s.sales_amount FROM sales_info AS s JOIN drug_info AS d JOIN user_info AS u WHERE d.drug_id IN (s.drug_id) AND u.user_id IN (s.user_id) AND s.sales_id=${searchValue};`)
        : 'SELECT s.sales_id, d.drug_name, u.user_name, s.sales_date, s.sales_quantity, s.sales_unit_price, s.sales_amount FROM sales_info AS s JOIN drug_info AS d JOIN user_info AS u WHERE d.drug_id IN (s.drug_id) AND u.user_id IN (s.user_id);'
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result, yield) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
//入库信息
const getRuku = (searchValue) => {
    const sql = searchValue ?
        (isNaN(searchValue) ? `SELECT p.purchase_id,p.user_id,u.user_name,p.purchase_date,p.purchase_total_amount,p.note FROM purchase_order AS p JOIN user_info AS u WHERE p.user_id=u.user_id AND (u.user_name LIKE '%${searchValue}' OR u.user_name LIKE '${searchValue}%' OR u.user_name LIKE '%${searchValue}%');
    `:
            `SELECT p.purchase_id,p.user_id,u.user_name,p.purchase_date,p.purchase_total_amount,p.note FROM purchase_order AS p JOIN user_info AS u WHERE p.user_id=u.user_id AND p.purchase_id=2;
    `)
        : 'SELECT p.purchase_id,p.user_id,u.user_name,p.purchase_date,p.purchase_total_amount,p.note FROM purchase_order AS p JOIN user_info AS u WHERE p.user_id=u.user_id;'
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result, yield) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
//我的进货信息
const getMyRuku = (user_id, startDate, endDate) => {
    console.log(startDate, endDate, 111)
    const sql = startDate ?
        `SELECT purchase_id,purchase_date,purchase_total_amount,note FROM purchase_order WHERE user_id=${user_id} AND purchase_date>='${startDate}' AND purchase_date<='${endDate}';
    `
        : `SELECT purchase_id,purchase_date,purchase_total_amount,note FROM purchase_order WHERE user_id=${user_id}`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result, yield) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
//我的购买记录
const getMyBuy = (user_id, searchValue) => {
    const sql = searchValue ?
        (isNaN(searchValue) ? `SELECT s.sales_id,d.drug_name,s.sales_date,s.sales_quantity,s.sales_amount FROM sales_info AS s JOIN drug_info AS d WHERE s.user_id=${user_id} AND d.drug_id=s.drug_id AND (d.drug_name LIKE '%${searchValue}' OR d.drug_name LIKE '${searchValue}%' OR d.drug_name LIKE '%${searchValue}%');
    `:
            `SELECT s.sales_id,d.drug_name,s.sales_date,s.sales_quantity,s.sales_amount FROM sales_info AS s JOIN drug_info AS d WHERE s.user_id=${user_id} AND d.drug_id=s.drug_id AND s.sales_id=${searchValue};
    `)
        : `SELECT s.sales_id,d.drug_name,s.sales_date,s.sales_quantity,s.sales_amount FROM sales_info AS s JOIN drug_info AS d WHERE s.user_id=${user_id} AND d.drug_id=s.drug_id;
    `
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result, yield) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
module.exports = {
    getValue, getMax, getMyRuku, updateUser, deleteUser, getUserList, deleteDrug, repairDrug, jinhuo, buyDrug, addDrug, getMyBuy, register, login, updateUserInfo, getDrugList, getKucun, getXiaoshou, getRuku
}