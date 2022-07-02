//品牌管理的数据
import request from "@/utils/request";
import {id} from "html-webpack-plugin/lib/chunksorter";

export const trademarkREQ = (page, limit) => request({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  methods: 'get'
})
//新增 不需要传入id ，id是由服务器生成的
export const addtrademarkREQ = (trademark) => {
  if (trademark.id) {
    return request({
      url: '/admin/product/baseTrademark/update',
      method: 'put',
      data: trademark
    })//修改品牌 品牌的id 名称 和品牌的logo
  } else {
    return request({
      url: '/admin/product/baseTrademark/save',
      method: 'post',
      data: trademark
    })
  }
}
//删除品牌的接口 需携带删除的品牌的 id
export const deleteREQ = (id) => request({
  url: `/admin/product/baseTrademark/${id}`,
  method: 'delete'
})
