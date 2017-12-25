import Mock from 'mockjs'
export const userCountData = () => Mock.mock('./admin/login','get',{
  status:1
})