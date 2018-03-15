import API from './api'
export default {
  methods: {
    loadArea (node, resolve) {
      if (node.level === 0) {
        let areas = []
        if (this.areas.length > 0) {
          areas = [this.areas[0]]
        }
        return resolve(areas)
      }
      if (node.level === 1) {
        let areas = []
        if (this.areas[0].children && this.areas[0].children.length > 0) {
          areas = this.areas[0].children
        }
        return resolve(areas)
      }
      if (node.level > 1) {
        let params = {
          pId: node.data.id
        }
        this.axios.get(API.get_area_list, { params }).then((res) => {
          resolve(res.rows)
        }).catch(() => {
          resolve([])
          this.$message({
            message: '获取子区域失败!',
            type: 'error'
          })
        })
      }
    }
  },
  computed: {
    initExpand () {
      var expand = []
      if (this.areas.length > 0) {
        expand.push(this.areas[0].id)
      }
      return expand
    }
  }
}
