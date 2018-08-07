//axios默认设置cookie
axios.defaults.withCredentials = true;
var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            visible: false,
            //菜单编码
            activeIndex: '',
            activeName: 'first',
            //搜索表单
            searchForm: {
                jbxx_xfssmc: '',
                jbxx_xfsslx: [],
                jbxx_jzmc: '',
                jbxx_iszddw:''
            },
            role_data: [],
            tableData: [],
            detailVisible: false,
            detailData: [],
            XFSSLX_data: [],

            //表高度变量
            tableheight: 443,
            //显示加载中样
            loading: false,
            loading_detail: false,
            labelPosition: 'right',
            //多选值
            multipleSelection: [],
            //当前页
            currentPage: 1,
            //分页大小
            pageSize: 10,
            //总记录数
            total: 10,
            //行数据
            rowdata: {},
            //序号
            indexData: 0,
            //树结构配置
            defaultProps: {
                children: 'children',
                label: 'codeName',
                value: 'codeValue'
            },
        }
    },
    created: function () {
        loadBreadcrumb("消防设施信息", "-1");
        this.roleData();
        this.getXFSSLXData();
        this.searchClick('click');
    },
    methods: {
        //当前登录用户信息
        roleData: function () {
            axios.post('/api/shiro').then(function (res) {
                this.role_data = res.data;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //表格查询事件
        searchClick: function (type) {
            if (type == 'page') {
                this.tableData = [];
            } else {
                this.currentPage = 1;
            }
            this.loading = true;//表格重新加载
            var params = {
                jbxx_xfssmc: this.searchForm.jbxx_xfssmc,
                jbxx_xfsslx: this.searchForm.jbxx_xfsslx[this.searchForm.jbxx_xfsslx.length - 1],
                jbxx_jzmc: this.searchForm.jbxx_jzmc,
                jbxx_iszddw: this.searchForm.jbxx_iszddw,
                pageSize: this.pageSize,
                pageNum: this.currentPage
            };
            axios.post('/dpapi/firefacilities/page', params).then(function (res) {
                var tableTemp = new Array((this.currentPage - 1) * this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                this.loading = false;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        clearClick: function () {
            this.searchForm.jbxx_xfssmc = "";
            this.searchForm.jbxx_xfsslx = [];
            this.searchForm.jbxx_jzmc = "";
            this.searchForm.jbxx_iszddw = "";
            this.searchClick('reset');
        },
        isZddwFormat: function (row, column) {
            var rowData = row[column.property];
            var isZddw = row.jbxx_iszddw;
            if (isZddw == null) {
                return null;
            } else if (isZddw == '0') {
                return '否';
            } else {
                return '是';
            }
        },
        zddwFormat: function (row, column) {
            var rowData = row[column.property];
            var isZddw = row.jbxx_iszddw;
            if (isZddw == null) {
                return null;
            } else if (isZddw == '0') {
                return '-';
            } else {
                return rowData;
            }
        },
        getXFSSLXData: function () {
            axios.get('/api/codelist/getDzlxTree/XFSSLX').then(function (res) {
                this.XFSSLX_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //表格勾选事件
        selectionChange: function (val) {
            this.multipleSelection = val;
        },
        detailClick: function (val) {
            this.detailVisible = true;
            this.rowdata = val;
            axios.post('/dpapi/firefacilities/doFindXfssDetail', val).then(function (res) {
                this.detailData = res.data.result;
                this.loading = false;
            }.bind(this), function (error) {
                console.log(error);
            })
            this.loading_detail = false;
        },
        closeDialog: function () {
            this.detailVisible = false;
        },
        //新增
        addClick: function () {
            var params = {
                ID: 0,
                type: "XZ"
            }
            loadDivParam("buildingzoning/firefacilities_add", params);
        },
        //编辑
        editClick: function (val) {
            var params = {
                ID: val.jbxx_xfssid,
                xfsslx: val.jbxx_xfsslx,
                type: "BJ"
            }
            loadDivParam("buildingzoning/firefacilities_add", params);
        },
        //删除
        deleteClick: function () {
            this.$confirm('确认删除选中信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                for (var i in this.multipleSelection) {
                    this.multipleSelection[i].xgrid = this.role_data.userid;
                    this.multipleSelection[i].xgrmc = this.role_data.realName;
                }
                axios.post('/dpapi/firefacilities/doDeleteFacilities', this.multipleSelection).then(function (res) {
                    this.$message({
                        message: "成功删除" + res.data.result + "条消防设施信息",
                        showClose: true,
                        onClose: this.searchClick('delete')
                    });
                }.bind(this), function (error) {
                    console.log(error)
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    },

})