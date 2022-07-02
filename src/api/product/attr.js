//平台管理属性
import request from "@/utils/request";
//获取一级分类接口地址
export const caregory1REQ = () => request({
  url: '/admin/product/getCategory1',
  method: 'get'
})
//获取2级分类接口地址
export const caregory2REQ = (category1Id) => request({
  url: `/admin/product/getCategory2/${category1Id}`,
  method: 'get'
})
//获取3级分类接口地址
export const caregory3REQ = (category2Id) => request({
  url: `/admin/product/getCategory3/${category2Id}`,
  method: 'get'
})
//获取商品数据
export const getAttrListREQ = ( category1Id, category2Id,category3Id) => request({
  url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method: 'get'
})
