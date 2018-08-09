//axios默认设置cookie
axios.defaults.withCredentials = true;
new Vue({
    el: '#app',
    data: function () {
        return {
            //菜单编号
            activeIndex: '',
            //新增修改标识（0新增，uuid修改）
            status: '',
            //显示加载中样
            loading: false,
            allYjlxDataTree: [],
            allXzqhDataTree: [],
            allSsdzDataTree: [],
            shiroData: [],
            //搜索表单
            addForm: {
                yjmc: "",
                yjbm: "",
                yjlx: [],
                sccj: "",
                pc: "",
                zcbl: '0.00',
                czl: '0.00',
                kcl: '0.00',
                scsj: "",
                hhb: "",
                cjrid: "",
                cjrmc: "",
                xgrid: "",
                xgrmc: "",
                xzqh: [],
                ssdz: [],
                ssdzmc: '',
                bz: '',
                jdh: ''
            },
            //树结构配置
            defaultProps: {
                children: 'children',
                label: 'codeName',
                value: 'codeValue'
            },
            ssdzProps: {
                children: 'children',
                label: 'dzjc',
                value: 'dzid'
            },
        }
    },
    created: function () {
        /**面包屑 by li.xue 20180628*/
        var type = getQueryString("type");
        if (type == "XZ") {
            loadBreadcrumb("消防药剂管理", "消防药剂管理新增");
        } else if (type == "BJ") {
            loadBreadcrumb("消防药剂管理", "消防药剂管理编辑");
        }
        this.status = getQueryString("ID");
        this.shiroData = shiroGlobal;
        this.getAllSsdzDataTree();
        this.getAllYjlxDataTree();
        this.getAllXzqhDataTree();
        
    },
    mounted: function () {
        this.searchClick();
    },
    methods: {
        //表格查询事件
        searchClick: function () {
            this.loading = true;
            if (this.status == 0) {  //新增
                this.loading = false;
            } else {//修改
                axios.get('/dpapi/firedrug/' + this.status).then(function (res) {
                    this.addForm = res.data.result;
                    //药剂类型格式化
                    if (this.addForm.yjlx != '' && this.addForm.yjlx != null) {
                        if (this.addForm.yjlx.endsWith("000000")) {
                            var yjlx = this.addForm.yjlx;
                            this.addForm.yjlx = [];
                            this.addForm.yjlx.push(yjlx);
                        } else if (this.addForm.yjlx.endsWith("0000")) {
                            var yjlx1 = this.addForm.yjlx.substring(0, 2) + '000000';
                            var yjlx2 = this.addForm.yjlx;
                            this.addForm.yjlx = [];
                            this.addForm.yjlx.push(yjlx1, yjlx2);
                        } else if (this.addForm.yjlx.endsWith("00")) {
                            var yjlx1 = this.addForm.yjlx.substring(0, 2) + '000000';
                            var yjlx2 = this.addForm.yjlx.substring(0, 4) + '0000';
                            var yjlx3 = this.addForm.yjlx;
                            this.addForm.yjlx = [];
                            this.addForm.yjlx.push(yjlx1, yjlx2, yjlx3);
                        }
                    } else {
                        this.addForm.yjlx = [];
                    }
                    //行政区划格式化
                    if (this.addForm.xzqh != '' && this.addForm.xzqh != null) {
                        if (this.addForm.xzqh.endsWith("0000")) {
                            var xzqh = this.addForm.xzqh;
                            this.addForm.xzqh = [];
                            this.addForm.xzqh.push(xzqh);
                        } else if (this.addForm.xzqh.endsWith("00")) {
                            var xzqh1 = this.addForm.xzqh.substring(0, 2) + '0000';
                            var xzqh2 = this.addForm.xzqh;
                            this.addForm.xzqh = [];
                            this.addForm.xzqh.push(xzqh1, xzqh2);
                        } else {
                            var xzqh1 = this.addForm.xzqh.substring(0, 2) + '0000';
                            var xzqh2 = this.addForm.xzqh.substring(0, 4) + '00';
                            var xzqh3 = this.addForm.xzqh;
                            this.addForm.xzqh = [];
                            this.addForm.xzqh.push(xzqh1, xzqh2, xzqh3);
                        }
                    } else {
                        this.addForm.xzqh = [];
                    }

                    //所属队站格式化
                    if (this.addForm.ssdz != '' && this.addForm.ssdz != null) {
                        for (var i in this.allSsdzDataTree) {
                            if (this.allSsdzDataTree[i].dzid == this.addForm.ssdz) {
                                var ssdz = this.addForm.ssdz;
                                this.addForm.ssdz = [];
                                this.addForm.ssdz.push(ssdz);
                                break;
                            } else {
                                for (var k in this.allSsdzDataTree[i].children) {
                                    if (this.allSsdzDataTree[i].children[k].dzid == this.addForm.ssdz) {
                                        var ssdz1 = this.allSsdzDataTree[i].dzid;
                                        var ssdz2 = this.allSsdzDataTree[i].children[k].dzid;
                                        this.addForm.ssdz = [];
                                        this.addForm.ssdz.push(ssdz1, ssdz2);
                                        break;
                                    } else {
                                        for (var j in this.allSsdzDataTree[i].children[k].children) {
                                            if (this.allSsdzDataTree[i].children[k].children[j].dzid == this.addForm.ssdz) {
                                                var ssdz1 = this.allSsdzDataTree[i].dzid;
                                                var ssdz2 = this.allSsdzDataTree[i].children[k].dzid;
                                                var ssdz3 = this.allSsdzDataTree[i].children[k].children[j].dzid;
                                                this.addForm.ssdz = [];
                                                this.addForm.ssdz.push(ssdz1, ssdz2, ssdz3);
                                                break;
                                            } else {
                                                for (var s in this.allSsdzDataTree[i].children[k].children[j].children) {
                                                    if (this.allSsdzDataTree[i].children[k].children[j].children[s].dzid == this.addForm.ssdz) {
                                                        var ssdz1 = this.allSsdzDataTree[i].dzid;
                                                        var ssdz2 = this.allSsdzDataTree[i].children[k].dzid;
                                                        var ssdz3 = this.allSsdzDataTree[i].children[k].children[j].dzid;
                                                        var ssdz4 = this.allSsdzDataTree[i].children[k].children[j].children[s].dzid;
                                                        this.addForm.ssdz = [];
                                                        this.addForm.ssdz.push(ssdz1, ssdz2, ssdz3, ssdz4);
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        this.addForm.ssdz = [];
                    }

                    this.loading = false;
                }.bind(this), function (error) {
                    console.log(error);
                })
            }
        },
        //药剂类型级联选择器数据
        getAllYjlxDataTree: function () {
            axios.post('/api/codelist/getYjlxTree/YJLX').then(function (res) {
                this.allYjlxDataTree = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //行政区划级联选择器数据
        getAllXzqhDataTree: function () {
            axios.get('/api/codelist/getXzqhTreeByUser').then(function (res) {
                this.allXzqhDataTree = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //所属队站级联选择器数据
        getAllSsdzDataTree: function () {
            var organization = this.shiroData.organizationVO;
            var param = {
                dzid: organization.uuid,
                dzjc: organization.jgjc,
                dzbm: organization.jgid
            }
            axios.post('/dpapi/xfdz/findSjdzByUser', param).then(function (res) {
                this.allSsdzDataTree = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        czlChange: function (value) {
            this.addForm.zcbl = parseFloat(value) + parseFloat(this.addForm.kcl);
        },
        kclChange: function (value) {
            this.addForm.zcbl = parseFloat(value) + parseFloat(this.addForm.czl);
        },
        pickerOptions0: {
            disabledDate(time) {
                return time.getTime() < Date.now() - 8.64e7;
            }
        },
        //保存
        save: function (formName) {
            if (this.addForm.yjmc == "" || this.addForm == null) {
                this.$message.warning({
                    message: '请输入药剂名称',
                    showClose: true
                });
            } else {
                if (this.status == 0) {//新增
                    this.addForm.cjrid = this.shiroData.userid;
                    this.addForm.cjrmc = this.shiroData.realName;
                    this.addForm.jdh = this.shiroData.organizationVO.jgid;
                    if (this.addForm.scsj != "") {
                        this.addForm.scsj = dateFormat(new Date(this.addForm.scsj));
                    }
                    var params = this.addForm;
                    if (this.addForm.yjlx.length > 0) {
                        params.yjlx = this.addForm.yjlx[this.addForm.yjlx.length - 1];
                    } else {
                        params.yjlx = '';
                    }
                    if (this.addForm.xzqh.length > 0) {
                        params.xzqh = this.addForm.xzqh[this.addForm.xzqh.length - 1];
                    } else {
                        params.xzqh = '';
                    }
                    if (this.addForm.ssdz.length > 0) {
                        params.ssdz = this.addForm.ssdz[this.addForm.ssdz.length - 1];
                    } else {
                        params.ssdz = '';
                    }
                    axios.post('/dpapi/firedrug/insertByVO', params).then(function (res) {
                        if (res.data.result >= 1) {
                            this.$alert('成功保存' + res.data.result + '条消防药剂信息', '提示', {
                                type: 'success',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/firedrug_list");
                                }
                            });
                        } else {
                            this.$alert('保存失败', '提示', {
                                type: 'error',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/firedrug_list");
                                }
                            });
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                } else {//修改
                    this.addForm.xgrid = this.shiroData.userid;
                    this.addForm.xgrmc = this.shiroData.realName;
                    if (this.addForm.scsj != "") {
                        this.addForm.scsj = dateFormat(new Date(this.addForm.scsj));
                    }
                    var params = this.addForm;
                    if (this.addForm.yjlx.length > 0) {
                        params.yjlx = this.addForm.yjlx[this.addForm.yjlx.length - 1];
                    } else {
                        params.yjlx = '';
                    }
                    if (this.addForm.xzqh.length > 0) {
                        params.xzqh = this.addForm.xzqh[this.addForm.xzqh.length - 1];
                    } else {
                        params.xzqh = '';
                    }
                    if (this.addForm.ssdz.length > 0) {
                        params.ssdz = this.addForm.ssdz[this.addForm.ssdz.length - 1];
                    } else {
                        params.ssdz = '';
                    }
                    axios.post('/dpapi/firedrug/doUpdateDrug', params).then(function (res) {
                        if (res.data.result >= 1) {
                            this.$alert('成功修改' + res.data.result + '条消防药剂信息', '提示', {
                                type: 'success',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/firedrug_list");
                                }
                            });
                        } else {
                            this.$alert('修改失败', '提示', {
                                type: 'error',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/firedrug_list");
                                }
                            });
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                }
            }
        },
        //取消
        cancel: function () {
            loadDiv("basicinfo/firedrug_list");
        }
    },

})