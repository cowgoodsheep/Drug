import serviceAxios from ".";
let user_id, user_name, password, telephone, address
let userinfo = localStorage.getItem('userinfo')
if ((userinfo)) {
  userinfo = JSON.parse(userinfo)
  user_id = userinfo.user_id
  user_name = userinfo.user_name
  password = userinfo.password
  telephone = userinfo.telephone
  address = userinfo.address
}

// 注册
export const register = async (postData) => {
  console.log(postData)
  const { data } = await serviceAxios.post('/user/register', postData)
  return data
}
// 登录
export const login = async (postData) => {
  const data = await serviceAxios.post('/user/login', postData)
  return data
}

// 修改个人信息
export const updateUserInfo = async (postData) => {
  postData.user_name = postData.user_name
  postData.password = postData.password
  postData.telephone = postData.telephone
  postData.address = postData.address
  const data = await serviceAxios.post('/user/update', { ...postData, user_id: user_id })
  return data
}

// 管理员修改用户信息
export const adminUpdateUser = async (postData) => {
  postData.user_name = postData.user_name
  postData.password = postData.password
  postData.role = postData.role
  postData.telephone = postData.telephone
  postData.address = postData.address
  const data = await serviceAxios.post('/user/update', { ...postData, user_id: user_id })
  return data
}

// 删除用户信息
export const deleteUser = async (user_id) => {
  const data = await serviceAxios.post('/user/delete', { user_id })
  return data
}

// 药品信息
export const getDrugList = async (searchValue) => {
  const data = await serviceAxios.post('/drug/getDrugList', { searchValue })
  return data
}
export const addDrug = async (postData) => {
  const data = await serviceAxios.post('/drug/addDrug', postData)
  return data
}
export const deleteDrug = async (drug_id) => {
  const data = await serviceAxios.post('/drug/deleteDrug', { drug_id })
  return data
}
export const repairDrug = async (postData) => {
  const { img, stock_lower_limit, stock_upper_limit, price, drug_description, drug_id } = JSON.parse(localStorage.getItem('drugMsg'))
  postData.img = postData.img || img
  postData.stock_lower_limit = postData.stock_lower_limit || stock_lower_limit
  postData.stock_upper_limit = postData.stock_upper_limit || stock_upper_limit
  postData.price = postData.price || price
  postData.drug_description = postData.drug_description || drug_description
  const data = await serviceAxios.post('/drug/repairDrug', { ...postData, drug_id })
  return data
}
export const jinhuo = async (postData) => {
  const drug_id = +localStorage.getItem('drugId')
  const data = await serviceAxios.post('/drug/jinhuo', { ...postData, user_id, drug_id })
  return data
}
export const buyDrug = async (postData) => {
  const data = await serviceAxios.post('/drug/buyDrug', { ...postData, user_id })
  return data
}
export const getMax = async () => {
  console.log(123)
  const drug_id = +localStorage.getItem('drugId')
  const data = await serviceAxios.post('/drug/getMax', { drug_id })
  const limit = data[1][0]['stock_upper_limit'] - data[0][0]['SUM(stock_info.remaining_quantity)']
  console.log(limit, 'set')
  return limit
}
export const getValue = async (drug_id) => {
  const data = await serviceAxios.post('/drug/getValue', { drug_id })
  console.log(data[0]['SUM(stock_info.remaining_quantity)'])
  return data[0]['SUM(stock_info.remaining_quantity)']
}

// 用户信息
export const getUserList = async (searchValue) => {
  const data = await serviceAxios.post('/user/getUserList', { searchValue })
  return data
}

// 库存信息
export const getAllKucun = async (searchValue) => {
  const data = await serviceAxios.post('/table/getKucun', { searchValue })
  return data
}

// 销售信息
export const getAllXiaoshou = async (searchValue) => {
  const data = await serviceAxios.post('/table/getXiaoshou', { searchValue })
  return data
}

// 入库信息
export const getAllRuku = async (searchValue) => {
  const data = await serviceAxios.post('/table/getRuku', { searchValue })
  return data
}

// 我的进货信息
export const getMyRuku = async () => {
  const startDate = localStorage.getItem('startDate')
  const endDate = localStorage.getItem('endDate')
  const data = await serviceAxios.post('/table/getMyRuku', { user_id, startDate, endDate })
  return data
}

// 我的购买信息
export const getAllBuy = async (searchValue) => {
  const data = await serviceAxios.post('/table/getBuy', { user_id, searchValue })
  return data
}
