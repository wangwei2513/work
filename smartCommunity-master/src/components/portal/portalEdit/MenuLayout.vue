<template>
  <div>
    <div class="edit-menulayout-title">菜单布局</div>
    <div class="edit-menulayout-content" v-loading="view.loading">
      <div class="grid-wp">
        <table>
          <tbody>
            <tr v-for="(row, index) in gridTds" class="grid-row" :key="index">
              <td 
                v-for="(col,index) in row" 
                v-if="col.render" 
                @click="selectTd($event, col.row, col.col, col)" 
                :colspan="col.colspan" :rowspan="col.rowspan" 
                class="grid-col" 
                :class="col.clazz"
                :key="index">
              </td>
            </tr>
          </tbody>
        </table>
        <div class="grid-btn-and-tip">
          <el-row>
            <el-col :span="3" :offset="1"><el-button type="primary" @click="checkSelectedValid" :disabled="view.selectMergeTd">合并</el-button></el-col>
            <el-col :span="3" :offset="1"><el-button type="primary" @click="cancelMerge" :disabled="!view.selectMergeTd">解除合并</el-button></el-col>
          </el-row>
          <el-row>
            <el-col :span="18" :offset="1"><el-alert
                :closable= "false"
                title="温馨提示：点击合并的网格编辑对应网格菜单下的海报资源"
                show-icon
                type="info">
              </el-alert>
            </el-col>
          </el-row>
          <div class="tip-wp">
            <el-row class="tip-row">
              <el-col :span="23" :offset="1" class="tip-text"><span class="tip-dot blue"></span><span>表示未合并未选中的网格</span></el-col>
            </el-row>
            <el-row class="tip-row">
              <el-col :span="23" :offset="1" class="tip-text"><span class="tip-dot green"></span><span>表示已合并未选中的网格</span></el-col>
            </el-row>
            <el-row class="tip-row">
              <el-col :span="23" :offset="1" class="tip-text"><span class="tip-dot yellow"></span><span>表示未合并已选中的网格</span></el-col>
            </el-row>
            <el-row class="tip-row">
              <el-col :span="23" :offset="1" class="tip-text"><span class="tip-dot red"></span><span>表示已合并已选中的网格</span></el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="grid-attr" v-show="view.selectMergeTd">
        <el-row type="flex" align="middle" >
          <el-col :span="24" class="grid-attr-head">设置网格属性</el-col>
        </el-row>
        <el-row type="flex" align="middle" >
          <el-col :span="4" class="grid-attr-title">该网格是否为视频框</el-col>
          <el-col :span="6">
            <el-switch
              v-model="curGridAttr.isVedio"
              active-text="是"
              inactive-text="否"
              :active-value="1"
              :inactive-value="0">
            </el-switch>
          </el-col>
        </el-row>

        <!-- 加载提示begin -->
        <el-row type="flex" align="middle" v-show="fieldsLoading">
          <div><i class="el-icon-loading"></i><span class="placeholder">加载中...</span></div>
        </el-row>
        <!-- 加载提示end -->

        <!-- 视频链接扩展字段begin -->
        <transition name="el-zoom-in-top">
          <el-row  type="flex" align="middle" v-show="curGridAttr.isVedio == 1">
            <el-col :span="4" class="grid-attr-title">视频链接</el-col>
            <el-col :span="6">
              <el-input size="mini" v-model="curGridAttr.videoUrl.url"></el-input>
              <transition name="el-zoom-in-top">
                <span class="custom-field-error-tip" v-show="view.curError.includes('videoUrl')">
                  url地址格式不正确，请检查后重新提交！
                  <i @click="view.curError.splice(view.curError.indexOf('videoUrl'), 1)" class="iconfont icon-arrows_remove"></i></span>
              </transition>
            </el-col>
          </el-row>
        </transition>
        <!-- 视频链接扩展字段end -->

        <!-- 有海报时,编辑的是海报所属的跳转url和图片 -->
        <el-row type="flex" align="middle" v-if="curGridAttr.poster[0].id !== ''">
          <el-col :span="4" class="grid-attr-title">海报图片</el-col>
          <el-col :span="20" class="grid-poster">
            <el-upload
              action=""
              class="grid-poster-upload"
              :on-change="handleFileChange"
              :fileList="curGridAttr.poster"
              :auto-upload="false"
              list-type="picture">
              <el-button type="primary" size="small">选择图片</el-button>
            </el-upload>
          </el-col>
        </el-row>
        <el-row type="flex" align="middle" v-if="curGridAttr.poster[0].id !== ''">
          <el-col :span="4" class="grid-attr-title">海报链接</el-col>
          <el-col :span="8"><el-input size="mini" v-model="curGridAttr.poster[0].outLink"></el-input></el-col>
          <el-col :span="2" :offset="1"><el-button size="mini" @click="showSelectRelatedApp">关联应用</el-button></el-col>
          <transition name="el-zoom-in-top">
            <span class="custom-field-error-tip" v-show="view.curError.includes('posterUrl')">
              url地址格式不正确，请检查后重新提交！
              <i @click="view.curError.splice(view.curError.indexOf('posterUrl'), 1)" class="iconfont icon-arrows_remove"></i></span>
          </transition>
        </el-row>

        <!-- 在没有海报的时候,编辑网格链接 -->
        <el-row type="flex" align="middle" v-if="curGridAttr.poster[0].id === ''">
          <el-col :span="4" class="grid-attr-title">网格链接</el-col>
          <el-col :span="8"><el-input size="mini" v-model="curGridAttr.url"></el-input></el-col>
          <el-col :span="2" :offset="1"><el-button size="mini" @click="showSelectRelatedApp">关联应用</el-button></el-col>
          <transition name="el-zoom-in-top">
            <span class="custom-field-error-tip" v-show="view.curError.includes('tdUrl')">
              url地址格式不正确，请检查后重新提交！
              <i @click="view.curError.splice(view.curError.indexOf('tdUrl'), 1)" class="iconfont icon-arrows_remove"></i></span>
          </transition>
        </el-row>
        
        <!--自定义字段begin  -->
        <custom-field-list :customFields="customFields" @editCustomField="editCustomField"></custom-field-list>
        <!--自定义字段end  -->

        <el-row type="flex" align="middle" >
          <el-col :span="4" class="grid-attr-title">扩展字段</el-col>
          <el-col :span="3"><el-button size="mini" @click="newCustomField">添加扩展字段</el-button></el-col>
        </el-row>

      </div>
    </div>

    <!--全局按钮begin  -->
    <div class="edit-menulayout-btn">
      <el-button type="primary" @click="submit" :disabled="!view.selectMergeTd" :loading="submiting">提交</el-button>
      <el-button :loading="submiting" @click="$emit('preview-portal')">预览</el-button>
    </div>
    <!--全局按钮end  -->

    <!--新增/编辑自定义字段messageBox begin  -->
    <custom-field
      :show.sync="view.addCustomShow"
      :customFieldData="customField"
      :isNew="view.isNewCustom"
      :curMenuId="curCts"
      :isGrid="true"
      :gridId="curGridCoordinate"
      :ckTdId="curTd && (curTd.row+1) + '_' + (curTd.col+1)"
      @update-custom-fields="getExtendFields">
    </custom-field>
    <!--新增/编辑自定义字段messageBox end  -->

    <!--选择关联应用messageBox begin  -->
    <relate-app
      v-if="view.selectRelatedAppShow"
      :relatedAppData="relatedApp"
      :relatedAppsData="relatedApps"
      :show.sync="view.selectRelatedAppShow"
      @selectApp="selectApp">
    </relate-app>
    <!--选择关联应用messageBox end  -->

  </div>
</template>
<script>
  import API from './../../../assets/js/api'
  import CustomField from './../../common/CustomField.vue'
  import RelateApp from './../../common/RelateApp.vue'
  import CustomFieldList from './../../common/CustomFieldList.vue'
  export default {
    name: 'menuLayout',
    props: {
      curCts: String,
      relatedAppsData: Array,
      imgSrcRoot: String,
      col: Number,
      row: Number
    },
    data () {
      return {
        curGridAttr: {
          isVedio: 0,
          url: '',
          extend: [],
          videoUrl: {
            url: '',
            id: ''
          },
          poster: [{
            name: '',
            url: '',
            outLink: '',
            id: ''
          }]
        },
        gridGroups: [
          {
            grid: [[]]
          }
        ],
        gridMap: {},
        // 单元格总体二维数组,存放了单元格的合并信息
        gridTds: [],
        // 选择的待合并的格子数组坐标 例如: [[1, 1], [0, 0]]
        selectedTds: [],
        // 选择的待合并的格子是否有效(判断其是否组成一个实心的矩形)
        selectedValid: false,
        // 选中的已合并的格子的第一个单元格的坐标
        selectedNode: {},
        // 选中的已合并的格子的坐标,宽高信息
        curTd: null,
        curGridCoordinate: '',
        posterLink: '',
        customFields: [],
        // 编辑自定义字段的内容
        customField: {
          title: '添加扩展字段',
          name: '',
          content: '',
          imgs: 0,
          fileList: [],
          link: ''
        },
        // 关联app参数
        relatedApp: {
          area: '福田区'
        },
        // app列表
        relatedApps: this.relatedAppsData,
        view: {
          selectMergeTd: false,
          addCustomShow: false,
          selectRelatedAppShow: false,
          isNewCustom: true,
          loading: false,
          curError: []
        },
        fieldsLoading: false,
        submiting: false
      }
    },
    components: {
      CustomField,
      RelateApp,
      CustomFieldList
    },
    computed: {
      gridCol () {
        if (this.gridGroups.length > 0) {
          return this.gridGroups[0].grid[0].length
        } else {
          return 0
        }
      },
      cols () {
        return this.gridGroups[0].grid[0] || []
      },
      gridRow () {
        if (this.gridGroups.length > 0) {
          return this.gridGroups[0].grid.length
        } else {
          return 0
        }
      },
      rows () {
        return this.gridGroups[0].grid || []
      }
    },
    watch: {
      curCts: {
        immediate: true,
        handler (newVal) {
          if (newVal) {
            /* 初始化选中状态 */
            this.view.selectMergeTd = false
            $('.grid-col').removeClass('selected')

            /* 获取栅格信息 */
            this.getMenuGrid()
          }
        }
      }
    },
    methods: {
      /**
       * 初始化单元格
       */
      initGrid () {
        this.gridTds = []
        this.selectedTds = []
        for (var i = 0; i < this.row; i++) {
          this.gridTds.push([])
          this.selectedTds.push([])
          for (var j = 0; j < this.col; j++) {
            this.gridTds[i].push({
              clazz: 'no-merge',
              colspan: 1,
              rowspan: 1,
              render: true,
              col: j,
              row: i
            })
            this.selectedTds[i].push(0)
          }
        }
      },
      getMenuGrid () {
        let params = new URLSearchParams()
        this.view.loading = true
        params.append('id', this.curCts)
        this.axios.post(API.get_portal_menu_grid, params).then((data) => {
          this.gridGroups = JSON.parse(data.msg)
          this.renderGrid()
          let gridMap = {}
          this.gridGroups.forEach(function (grid) {
            let { extend, isVedio, url, grid: id } = grid
            gridMap[this.arr2string(id)] = {
              extend,
              isVedio,
              url
            }
          }, this)
          this.gridMap = gridMap
          this.view.loading = false
        }).catch(() => {
          this.view.loading = false
        })
      },
      getExtendFields () {
        let params = {
          gridId: this.curGridCoordinate,
          id: this.curCts
        }
        this.fieldsLoading = true
        this.axios.get(API.get_portal_grid_field, { params }).then((fields) => {
          this.fieldsLoading = false
          let alias = []
          fields.forEach(function (field) {
            if (field.key === 'poster') {
              /* 海报资源单独显示在顶部 */
              if (field.src[0]) {
                this.curGridAttr.poster = [{
                  name: '',
                  url: this.imgSrcRoot + field.src[0] + '?' + Date.now(),
                  outLink: field.url,
                  id: field.id
                }]
              }
            } else if (field.key === 'videoUrl') {
              this.curGridAttr.videoUrl = {
                url: field.url,
                id: field.id
              }
            } else {
              let fieldAlias = {
                id: field.id,
                name: field.key,
                fileList: [],
                link: field.url,
                content: field.desc
              }
              field.src.forEach(function (img) {
                if (img) {
                  fieldAlias.fileList.push({
                    name: '',
                    url: this.imgSrcRoot + img + '?' + Date.now()
                  })
                }
              }, this)
              alias.push(fieldAlias)
            }
          }, this)
          this.customFields = alias
        }).catch(() => {
          this.fieldsLoading = false
          this.$message({
            message: '获取单元格扩展字段失败!',
            type: 'error'
          })
        })
      },
      /**
      *根据接受的合并单元格坐标数据，转换为vue列表渲染所能支持的数据结构
      */
      renderGrid () {
        this.initGrid()
        var gridGroup = this.gridGroups
        for (var i = 0; i < gridGroup.length; i++) {
          var grid = gridGroup[i].grid
          var findFirst = false
          for (var j = 0; j < grid.length; j++) {
            var row = grid[j]
            for (var k = 0; k < row.length; k++) {
              var col = row[k]
              if (col === 1) {
                if (!findFirst) {
                  var n = 0
                  var colspan = 1
                  var rowspan = 1
                  while (n + k + 1 < row.length) {
                    if (row[n + k + 1] === 1) {
                      colspan++
                    }
                    n++
                  }
                  n = 0
                  while (n + j + 1 < grid.length) {
                    if (grid[n + j + 1][k] === 1) {
                      rowspan++
                    }
                    n++
                  }
                  for (n = 0; n < colspan; n++) {
                    for (var m = 0; m < rowspan; m++) {
                      this.gridTds[j + m][k + n].render = false
                      this.gridTds[j + m][k + n].clazz = 'merge'
                    }
                  }
                  this.gridTds[j][k].clazz = 'merge'
                  this.gridTds[j][k].colspan = colspan
                  this.gridTds[j][k].rowspan = rowspan
                  this.gridTds[j][k].render = true
                  findFirst = true
                  break
                }
              }
            }
            if (findFirst) {
              break
            }
          }
        }
      },
      /**
      *检查所选单元格是否符合合并要求（组成一个实心矩形）
      */
      checkSelectedValid () {
        const map = this.selectedTds
        var nodeValid = true
        var findFirst = false
        var colspan = 0
        var rowspan = 0
        var firstNode = {
          x: -1,
          y: -1
        }
        for (var i = 0; i < map.length; i++) {
          var row = map[i]
          for (var j = 0; j < row.length; j++) {
            var col = row[j]
            if (col === 1) {
              colspan++
              rowspan++
              if (!findFirst) {
                findFirst = true
                firstNode = {
                  x: j,
                  y: i
                }
                var n = 0
                while (n + j + 1 < row.length) {
                  if (map[i][n + j + 1] === 1) {
                    colspan++
                  } else {
                    break
                  }
                  n++
                }
                n = 0
                while (n + i + 1 < map.length) {
                  if (map[n + i + 1][j] === 1) {
                    rowspan++
                  } else {
                    break
                  }
                  n++
                }
                break
              }
            }
          }
          if (findFirst) {
            break
          }
        }
        for (i = 0; i < map.length; i++) {
          row = map[i]
          for (j = 0; j < row.length; j++) {
            col = row[j]
            if (firstNode.x <= j && j < firstNode.x + colspan && firstNode.y <= i && i < firstNode.y + rowspan) {
              if (col !== 1) {
                console.log('in:' + i + '-' + j)
                nodeValid = false
                break
              }
            } else {
              if (col !== 0) {
                console.log('out:' + i + '-' + j)
                nodeValid = false
                break
              }
            }
          }
          if (!nodeValid) {
            break
          }
        }
        if (nodeValid && firstNode.x !== -1 && firstNode.y !== -1) {
          this.selectedNode = firstNode
          this.mergeGrid()
        } else {
          this.$message({
            message: '无效合并',
            type: 'error'
          })
        }
      },
      /**
      *合并单元格，将所有合并的单元格（接口要求发送所有）坐标转换为字符串形式发送给服务器
      */
      mergeGrid () {
        var result = {}

        /* 将初始的单元格转换为单元格二维数组坐标 */
        var tds = this.gridTds // 所有初始的单元格二维数组
        for (var i = 0; i < tds.length; i++) {
          var row = tds[i]
          for (var j = 0; j < row.length; j++) {
            var col = row[j]
            if (col.render && col.clazz === 'merge') {
              var arr = this.td2Coordinate(this.gridCol, this.gridRow, col)
              result[col.col + '' + col.row] = arr
            }
          }
        }

        /* 将新选择的单元格放到结果集中 */
        result[this.selectedNode.x + '' + this.selectedNode.y] = this.selectedTds

        /* 将单元格坐标数组按照行序号和列序号之和的大小排序 */
        var sortResultArr = []
        var keys = Object.keys(result)
        keys.sort()
        keys.forEach(function (key) {
          sortResultArr.push(result[key])
        }, this)

        /* 将所有的单元格二维坐标转换为一维字符串 */
        var strResult = this.arr2string(sortResultArr, ',')

        let params = new URLSearchParams()
        params.append('arrA', strResult)
        params.append('curMenuId', this.curCts)
        this.axios.post(API.merge_portal_menu_grid, params).then(() => {
          this.getMenuGrid()
          this.$message({
            message: '合并成功',
            type: 'success'
          })
        }).catch(() => {
          this.$message({
            message: '合并失败!',
            type: 'error'
          })
        })
      },
      /**
      *深度遍历数组，将数组的内容用分割符转成字符串
      *@param {array} arr 需要遍历的数组
      *@param {string} split 分隔符
      *@return {string} 转化后的字符串
      */
      arr2string (arr, split) {
        var result = []
        arr.forEach(function (element) {
          if (Array.isArray(element)) {
            result.push(this.arr2string(element, split))
          } else {
            result.push(element)
          }
        }, this)
        return result.join(split)
      },
      /**
      *单元格点击事件
      *@param {object} e 事件对象
      *@param {number} row 所点击单元格的行索引（从0开始）
      *@param {number} col 所点击单元格的列索引（从0开始）
      */
      selectTd (e, row, col, td) {
        /* 初始化单元格选中属性 */
        this.curTd = null
        this.curGridCoordinate = ''
        this.curGridAttr = {
          isVedio: 0,
          url: '',
          extend: [],
          videoUrl: {
            url: '',
            id: ''
          },
          poster: [{
            name: '',
            url: '',
            outLink: '',
            id: ''
          }]
        }

        var $target = $(e.target)
        if ($target.hasClass('merge')) {
          if ($target.hasClass('selected')) {
            $target.removeClass('selected')
            this.view.selectMergeTd = false
          } else {
            this.initSelectedTds()
            this.view.selectMergeTd = true
            $('.grid-col.selected').removeClass('selected')
            $target.addClass('selected')
            this.changeSelect(td)
          }
        } else {
          this.view.selectMergeTd = false
          $('.grid-col.merge.selected').removeClass('selected')
          $target.toggleClass('selected')
          this.selectedTds[row][col] = this.selectedTds[row][col] === 1 ? 0 : 1
        }
      },
      initSelectedTds () {
        for (var i = 0; i < this.selectedTds.length; i++) {
          var row = this.selectedTds[i]
          for (var j = 0; j < row.length; j++) {
            this.selectedTds[i][j] = 0
          }
        }
      },
      changeSelect (td) {
        this.curTd = td
        this.curGridCoordinate = this.td2Coordinate(this.gridCol, this.gridRow, td).join(',')
        this.curGridAttr = this.gridMap[this.curGridCoordinate] || {
          isVedio: 0,
          url: '',
          extend: []
        }
        this.curGridAttr.poster = [{
          name: '',
          url: '',
          outLink: '',
          id: ''
        }]
        this.curGridAttr.videoUrl = {
          url: '',
          id: ''
        }
        this.getExtendFields()
      },
      td2Coordinate (totalCol, totalRow, td) {
        let result = []
        let { col, row, colspan, rowspan } = td
        for (var i = 0; i < totalRow; i++) {
          for (var j = 0; j < totalCol; j++) {
            if (i < row || i > row + rowspan - 1 || j < col || j > col + colspan - 1) {
              result.push(0)
            } else {
              result.push(1)
            }
          }
        }
        return result
      },
      cancelMerge () {
        let totalCol = this.col
        let totalRow = this.row
        let result = this.td2Coordinate(totalCol, totalRow, this.curTd)
        
        let params = new URLSearchParams()
        params.append('gridId', result.join(','))
        params.append('curMenuId', this.curCts)
        this.axios.post(API.release_portal_menu_grid, params).then(() => {
          this.getMenuGrid()
          this.view.selectMergeTd = false
          this.$message({
            message: '解除合并成功!',
            type: 'success'
          })
        }).catch(() => {
          this.$message({
            message: '解除合并失败!',
            type: 'error'
          })
        })
      },
      selectApp (link) {
        this.posterLink = link
      },
      showSelectRelatedApp () {
        this.view.selectRelatedAppShow = true
      },
      submit () {
        const match = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
        var valid = true
        if (this.curGridAttr.poster[0].outLink !== '' && !match.test(this.curGridAttr.poster[0].outLink)) {
          !this.view.curError.includes('posterUrl') && this.view.curError.push('posterUrl')
          valid = false
        }
        if (this.curGridAttr.videoUrl.url !== '' && !match.test(this.curGridAttr.videoUrl.url)) {
          !this.view.curError.includes('videoUrl') && this.view.curError.push('videoUrl')
          valid = false
        }
        if (this.curGridAttr.url !== '' && !match.test(this.curGridAttr.url)) {
          !this.view.curError.includes('tdUrl') && this.view.curError.push('tdUrl')
          valid = false
        }
        if (!valid) {
          setTimeout(() => {
            this.view.curError = []
          }, 3000)
          return false
        }
        
        let requests = [this.updateGrid()]
        if (this.curGridAttr.poster[0].id !== '') {
          requests.push(this.editPoster(this.curGridAttr.poster[0]))
        }
        if (this.curGridAttr.isVedio === 1) {
          requests.push(this.editVideoUrl(this.curGridAttr.videoUrl, this.curGridAttr.videoUrl.id === ''))
        }
        this.submiting = true
        Promise.all(requests).then(() => {
          this.submiting = false
          this.$message({
            message: '更新单元格信息成功!',
            type: 'success'
          })
        }).catch(() => {
          this.submiting = false
          this.$message({
            message: '更新单元格信息失败!',
            type: 'error'
          })
        })
      },
      updateGrid () {
        let params = new FormData()
        params.append('id', this.curCts)
        params.append('url', this.curGridAttr.url)
        params.append('isVedio', this.curGridAttr.isVedio)
        params.append('gridId', this.curGridCoordinate)
        return this.axios.post(API.edit_portal_grid_info, params)
      },
      editPoster (poster) {
        let params = new FormData()
        params.append('url', poster.outLink)
        if (poster.raw) {
          params.append('posterImg', poster.raw)
        }
        /* 必传参数begin */
        params.append('type', 3)
        params.append('key', 'poster')
        params.append('id', this.curCts)
        params.append('extendId', poster.id)
        params.append('gridId', this.curGridCoordinate)
        params.append('ckTdId', (this.curTd.row + 1) + '_' + (this.curTd.col + 1))
        /* 必传参数end */
        return this.axios.post(API.edit_portal_grid_field, params)
      },
      editVideoUrl (videoUrl, isNew) {
        let params = new FormData()
        var url = ''
        if (isNew) {
          url = API.add_portal_grid_field
          params.append('key', 'videoUrl')
        } else {
          url = API.edit_portal_grid_field
          params.append('extendId', videoUrl.id)
        }

        /* 必传参数begin */
        params.append('type', 3)
        params.append('id', this.curCts)
        params.append('url', videoUrl.url)
        params.append('gridId', this.curGridCoordinate)
        /* 必传参数end */
        return this.axios.post(url, params)
      },
      handleFileChange (file, fileList) {
        if (fileList.length > 1) {
          fileList.shift()
        }
        this.curGridAttr.poster[0].raw = fileList.length === 0 ? null : fileList[0].raw
      },
      newCustomField () {
        this.view.addCustomShow = true
        this.view.isNewCustom = true
      },
      editCustomField (fieldData) {
        this.view.addCustomShow = true
        this.view.isNewCustom = false
        this.customField = fieldData
      }
    }
  }
</script>
<style scoped>
  .edit-menulayout-title{
    height: 48px;
    line-height: 48px;
    text-align: center;
    font-size: 14px;
    border-bottom: thin solid #d3dce6;
    background-color: #eff2f7;
    color: #1f2d3d;
  }
  .edit-menulayout-content{
    height: 500px;
    padding: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    font-size: 14px;
    box-sizing: border-box;
  }
  .edit-menulayout-btn{
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
  }
  .grid-wp{
    height: 200px;
    width: 100%;
  }
  
  .grid-attr-head{
    font-size: 14px;
    color: #1f2d3d;
    font-weight: bold;
    padding-top: 10px;
  }
  .grid-attr-title{
    color: #7b828c;
  }
  .grid-poster{
    height: 60px;
  }
  .grid-poster-upload{
    display: flex;
    align-items: center;
    height: 60px;
  }
  .grid-wp table{
    height: 100%;
    width: 400px;
    float: left;
    table-layout: fixed;
    border-collapse: separate;
    border-spacing: 2px;
  }
  .grid-wp table td.no-merge,.tip-dot.blue{
    background-color: #69e4f8;
  }
  .grid-wp table td.no-merge.selected,.tip-dot.yellow{
    background-color: #e2f183;
  }
  .grid-wp table td.merge,.tip-dot.green{
    background-color: #6be3b4;
  }
  .grid-wp table td.merge.selected,.tip-dot.red{
    background-color: #f58989;
  }
  .grid-btn-and-tip{
    width: calc(100% - 400px);
    position: relative;
    height: 100%;
    float: left;
  }
  .tip-dot{
    display: inline-block;
    height: 12px;
    width: 12px;
    border-radius: 50%;
  }
  .tip-text span{
    vertical-align: middle;
    font-size: 12px;
    color: #7c828d;
    margin-right: 10px;
  }
  .grid-btn-and-tip .el-row{
    padding-bottom: 10px;
  }
  .tip-wp{
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
  }
  .tip-wp .tip-row{
    padding-bottom: 2px;
  }
  .tip-row:last-of-type{
    padding: 0;
  }
  .custom-field-error-tip{
    position: absolute;
    top: 45px;
    left: 160px;
    font-size: 12px;
    color: #FA5555;
    z-index: 1;
  }
  .icon-arrows_remove{
    position: absolute;
    right: -24px;
    top: 0px;
    height: 12px;
    font-size: 22px;
    line-height: 17px;
  }
</style>
<style>
  .grid-poster .el-upload-list{
    margin-left: 10px !important;
    display: flex;
    flex-wrap: wrap;
    height: 60px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .grid-poster .el-upload-list li{
    margin-top: 0;
    margin-right: 10px;
    height: 60px;
    width: 120px;
    padding: 4px 10px 10px 60px;
  }
  .grid-poster .el-upload-list li img{
    width: 50px;
    height: 50px;
    margin-left: -55px;
  }
  .grid-poster .el-upload-list .el-icon-document{
    font-size: 40px;
    left: 10px;
    top: 8px;
  }
  .grid-poster .el-upload-list--picture .el-upload-list__item-name {
    display: none;
  }
  .grid-poster .el-icon-document{
    display: none;
  }
  .grid-attr .el-row{
    padding: 12px 0;
  }
</style>
