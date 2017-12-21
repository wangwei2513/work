import Mock from 'mockjs'
export default (url = '' , type = 'get' , template) => {
  Mock.mock(url, type, template)
}
