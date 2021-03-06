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
            allTypesDataTree: [],
            allXzqhDataTree: [],
            allSsdzDataTree: [],
            shiroData: [],
            //搜索表单
            addForm: {
                zbmc: '',
                zbbm: '',
                ssdz: '',
                ssdzmc: '',
                xzqh: '',
                zblx: '',
                sccj: '',
                zcbl: '',
                kysl: '',
                shsl: '',
                zzsl: 0,
                bz: '',
                cjrid: '',
                cjrmc: '',
                xgrid: '',
                xgrmc: '',
                bz: '',
                jdh: '',
                equipengineVOList: [{
                    clid: '',
                    clmc: '',
                    clzzs: ''
                }]
            },
            // engineForm: [{
            //     clid: '',
            //     clmc: '',
            //     clzzs: ''
            // }],
            clIndex: '',
            //信息校验规则
            inforRules: {
                zbmc: [{ required: true, message: '请输入装备名称', trigger: 'blur' }],
                zbbm: [{ pattern: /^[A-Za-z0-9 ]+$/, message: '装备编码应为数字或字母', trigger: 'blur' }],
                ssdz: [{
                    validator: (rule, value, callback) => {
                        if (value.length == 0) {
                            callback(new Error("请选择所属队站"));
                        } else {
                            callback();
                        }

                    }, trigger: 'change'
                }],
                kysl: [{ pattern: /^[1-9]\d*|0$/, message: '库存数量(可用) 应为正整数', trigger: 'blur' }],
                shsl: [{ pattern: /^[1-9]\d*|0$/, message: '库存数量(损坏) 应为正整数', trigger: 'blur' }],
                clzzs:[{ pattern: /^[1-9]\d*|0$/, message: '装载数量 应为正整数', trigger: 'blur' }]
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
            //消防车辆弹出页---------------------------------------------------
            engineListVisible: false,
            loading_engine: false,
            //当前页
            currentPage: 1,
            //分页大小
            pageSize: 5,
            //总记录数
            total: 0,
            //搜索表单
            searchForm: {
                clmc: '',
                cphm: ''
            },
            tableData: [],
            //表高度变量
            tableheight: 243,
        }
    },
    created: function () {
        var type = getQueryString("type");
        if (type == "XZ") {
            loadBreadcrumb("装备器材管理", "装备器材管理新增");
        } else if (type == "BJ") {
            loadBreadcrumb("装备器材管理", "装备器材管理编辑");
        }
        this.shiroData = shiroGlobal;
        this.status = getQueryString("ID");
        this.getAllTypesDataTree();//装备类型级联选择数据
        this.getAllXzqhDataTree();//行政区划
        this.getAllSsdzDataTree();
    },
    mounted: function () {
        // this.searchClick();
    },
    methods: {
        //车辆+
        addDomain: function () {
            this.addForm.equipengineVOList.push({
                clid: '',
                clmc: '',
                clzzs: ''
            });
        },
        //车辆-
        removeDomain: function (item) {
            var index = this.addForm.equipengineVOList.indexOf(item)
            if (index !== -1) {
                this.addForm.equipengineVOList.splice(index, 1)
            }
        },
        //消防车辆弹出页---------------------------------------------------------------
        engineList: function (type, val) {
            if (type == 'page') {
                this.tableData = [];
            } else {
                if (type == 'init') {
                    this.clIndex = val;
                    this.searchForm.clmc = '';
                    this.searchForm.cphm = '';
                }
                this.currentPage = 1;
            }
            this.engineListVisible = true;
            this.loading_engine = true;
            //所属队站
            var ssdz = "";
            if (this.shiroData.organizationVO.jgid.substr(2, 6) != '000000') {
                ssdz = this.shiroData.organizationVO.uuid;
            }
            var params = {
                clmc: this.searchForm.clmc,
                cphm: this.searchForm.cphm,
                ssdz: ssdz,
                jdh: this.shiroData.organizationVO.jgid.substr(0, 2) + '000000',
                pageSize: this.pageSize,
                pageNum: this.currentPage,
                orgUuid: this.shiroData.organizationVO.uuid,
                orgJgid: this.shiroData.organizationVO.jgid
            };
            axios.post('/dpapi/fireengine/page', params).then(function (res) {
                var tableTemp = new Array((this.currentPage - 1) * this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                this.loading_engine = false;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //车辆弹出页翻页
        currentPageChange: function (val) {
            if (this.currentPage != val) {
                this.currentPage = val;
                this.engineList('page', this.clIndex);
            }
        },

        //选择车辆，返回车辆名称和id
        selectRow: function (val) {
            var index = this.clIndex;
            this.addForm.equipengineVOList[index].clid = val.uuid
            this.addForm.equipengineVOList[index].clmc = val.clmc
            this.engineListVisible = false;
        },
        //车辆查询条件清空
        clearEngineList: function (val) {
            this.searchForm.clmc = "";
            this.searchForm.cphm = "";
            this.engineList('reset', this.clIndex);
        },

        //表格查询事件
        searchClick: function () {
            this.loading = true;
            if (this.status == 0) {  //新增
                this.loading = false;
            } else {//修改
                axios.get('/dpapi/equipmentsource/' + this.status).then(function (res) {
                    this.addForm = res.data.result;
                    //装备类型格式化
                    var zblxArray = [];
                    if (this.addForm.zblx != null && this.addForm.zblx != "" && !this.addForm.zblx.endsWith("0000000")) {
                        zblxArray.push(this.addForm.zblx.substr(0, 1) + "0000000");
                        if (!this.addForm.zblx.endsWith("000000")) {
                            zblxArray.push(this.addForm.zblx.substr(0, 2) + '000000');
                            if (!this.addForm.zblx.endsWith("0000")) {
                                zblxArray.push(this.addForm.zblx.substr(0, 4) + '0000');
                                if (!this.addForm.zblx.endsWith("00")) {
                                    zblxArray.push(this.addForm.zblx.substr(0, 6) + '00');
                                }
                            }
                        }
                    }
                    zblxArray.push(this.addForm.zblx);
                    this.addForm.zblx = zblxArray;

                    //行政区划格式化
                    var xzqhArray = [];
                    if (this.addForm.xzqh != null && this.addForm.xzqh != "" && this.addForm.xzqh.substr(2, 4) != "0000") {
                        xzqhArray.push(this.addForm.xzqh.substr(0, 2) + "0000");
                        if (this.addForm.xzqh.substr(4, 2) != "00") {
                            xzqhArray.push(this.addForm.xzqh.substr(0, 4) + "00");
                        }
                    }
                    xzqhArray.push(this.addForm.xzqh);
                    this.addForm.xzqh = xzqhArray;
                    //所属队站格式化
                    var sjdzArray = [];
                    var temp = this.addForm.ssdz;
                    for (var i in this.allSsdzDataTree) {
                        if (temp == this.allSsdzDataTree[i].dzid) {
                            sjdzArray.push(this.allSsdzDataTree[i].dzid);
                        } else {
                            for (var j in this.allSsdzDataTree[i].children) {
                                if (temp == this.allSsdzDataTree[i].children[j].dzid) {
                                    sjdzArray.push(this.allSsdzDataTree[i].dzid, this.allSsdzDataTree[i].children[j].dzid);
                                } else {
                                    for (var k in this.allSsdzDataTree[i].children[j].children) {
                                        if (temp == this.allSsdzDataTree[i].children[j].children[k].dzid) {
                                            sjdzArray.push(this.allSsdzDataTree[i].dzid, this.allSsdzDataTree[i].children[j].dzid, this.allSsdzDataTree[i].children[j].children[k].dzid);
                                        } else {
                                            for (var n in this.allSsdzDataTree[i].children[j].children[k].children) {
                                                if (temp == this.allSsdzDataTree[i].children[j].children[k].children[n].dzid) {
                                                    sjdzArray.push(this.allSsdzDataTree[i].dzid, this.allSsdzDataTree[i].children[j].dzid, this.allSsdzDataTree[i].children[j].children[k].dzid, this.allSsdzDataTree[i].children[j].children[k].children[n].dzid);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.addForm.ssdz = sjdzArray;

                    //消防车辆查询
                    var params = {
                        zbid: this.addForm.uuid
                    };
                    axios.post('/dpapi/equipengine/list', params).then(function (res) {
                        this.addForm.equipengineVOList = res.data.result;
                        if (this.addForm.equipengineVOList == '' || this.addForm.equipengineVOList == null) {
                            this.addDomain();
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                    this.loading = false;
                }.bind(this), function (error) {
                    console.log(error);
                })
            }
        },
        //装备类型级联选择数据
        getAllTypesDataTree: function () {
            var params = {
                codetype: "ZBQCLX",
                list: [1, 2, 4, 6, 8]
            };
            axios.post('/api/codelist/getCodelisttree2', params).then(function (res) {
                this.allTypesDataTree = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //行政区划级联选择数据
        getAllXzqhDataTree: function () {
            axios.get('/api/codelist/getXzqhTreeByUser').then(function (res) {
                this.allXzqhDataTree = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //所属队站级联选择器数据
        getAllSsdzDataTree: function () {
            var param = {
                dzid: this.shiroData.organizationVO.uuid,
                dzjc: this.shiroData.organizationVO.jgjc,
                dzbm: this.shiroData.organizationVO.jgid
            }
            axios.post('/dpapi/xfdz/findSjdzByUserAll', param).then(function (res) {
                this.allSsdzDataTree = res.data.result;
                this.searchClick();
            }.bind(this), function (error) {
                console.log(error);
            })
        },

        //保存前校验
        checkForm: function () {
            if (this.addForm.zbmc == '' || this.addForm == null) {
                this.$message.warning({
                    message: '请输入装备名称!',
                    showClose: true
                });
                return false;
            } else if (this.addForm.ssdz.length == 0) {
                this.$message.warning({
                    message: '请选择所属队站!',
                    showClose: true
                });
                return false;
            }
            for (var i in this.addForm.equipengineVOList) {
                if (this.addForm.equipengineVOList[i].clid == '' && this.addForm.equipengineVOList[i].clzzs == 0) {
                    this.removeDomain(this.addForm.equipengineVOList[i]);
                    return true;
                } else if (this.addForm.equipengineVOList[i].clid == '' && this.addForm.equipengineVOList[i].clzzs > 0) {
                    this.$message.warning({
                        message: '请选择消防车辆!',
                        showClose: true
                    });
                    return false;
                }
            }
            return true;
        },
        //保存
        save: function (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.status == 0) {//新增
                        for (var i in this.addForm.equipengineVOList) {
                            this.addForm.zzsl = parseInt(this.addForm.zzsl) + parseInt(this.addForm.equipengineVOList[i].clzzs);
                        }
                        this.addForm.zcbl = parseInt(this.addForm.kysl) + parseInt(this.addForm.shsl) + parseInt(this.addForm.zzsl);
                        var params = {
                            zbmc: this.addForm.zbmc,
                            zbbm: this.addForm.zbbm,
                            ssdz: this.addForm.ssdz[this.addForm.ssdz.length - 1],
                            ssdzmc: this.addForm.zbbssdzmcm,
                            xzqh: this.addForm.xzqh[this.addForm.xzqh.length - 1],
                            zblx: this.addForm.zblx[this.addForm.zblx.length - 1],
                            sccj: this.addForm.sccj,
                            zcbl: this.addForm.zcbl,
                            kysl: this.addForm.kysl,
                            shsl: this.addForm.shsl,
                            zzsl: this.addForm.zzsl,
                            bz: this.addForm.bz,
                            cjrid: this.shiroData.userid,
                            cjrmc: this.shiroData.realName,
                            bz: this.addForm.bz,
                            jdh: this.shiroData.organizationVO.jgid.substr(0, 2) + '000000',
                            datasource: this.shiroData.organizationVO.jgid,
                            equipengineVOList: this.addForm.equipengineVOList
                        }
                        axios.post('/dpapi/equipmentsource/insertByVO', params).then(function (res) {
                            if (res.data.result.uuid != null && res.data.result.uuid != '') {
                                this.$alert('保存成功', '提示', {
                                    type: 'success',
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        loadDiv("basicinfo/equipment_list");
                                    }
                                });
                            } else {
                                this.$alert('保存失败', '提示', {
                                    type: 'error',
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        loadDiv("basicinfo/equipment_list");
                                    }
                                });
                            }
                        }.bind(this), function (error) {
                            console.log(error);
                        })
                    } else {//修改
                        this.addForm.zzsl = 0;
                        for (var i in this.addForm.equipengineVOList) {
                            this.addForm.zzsl = parseInt(this.addForm.zzsl) + parseInt(this.addForm.equipengineVOList[i].clzzs);
                        }
                        this.addForm.zcbl = parseInt(this.addForm.kysl) + parseInt(this.addForm.shsl) + parseInt(this.addForm.zzsl);
                        var params = {
                            uuid: this.addForm.uuid,
                            zbmc: this.addForm.zbmc,
                            zbbm: this.addForm.zbbm,
                            ssdz: this.addForm.ssdz[this.addForm.ssdz.length - 1],
                            ssdzmc: this.addForm.zbbssdzmcm,
                            xzqh: this.addForm.xzqh[this.addForm.xzqh.length - 1],
                            zblx: this.addForm.zblx[this.addForm.zblx.length - 1],
                            sccj: this.addForm.sccj,
                            zcbl: this.addForm.zcbl,
                            kysl: this.addForm.kysl,
                            shsl: this.addForm.shsl,
                            zzsl: this.addForm.zzsl,
                            bz: this.addForm.bz,
                            xgrid: this.shiroData.userid,
                            xgrmc: this.shiroData.realName,
                            bz: this.addForm.bz,
                            // jdh: this.shiroData.organizationVO.jgid.substr(0,2)+'000000',
                            datasource: this.shiroData.organizationVO.jgid,
                            equipengineVOList: this.addForm.equipengineVOList
                        }
                        axios.post('/dpapi/equipmentsource/doUpdateEquipment', params).then(function (res) {
                            if (res.data.result != null && res.data.result != '') {
                                this.$alert('修改成功', '提示', {
                                    type: 'success',
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        loadDiv("basicinfo/equipment_list");
                                    }
                                });
                            } else {
                                this.$alert('修改失败', '提示', {
                                    type: 'error',
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        loadDiv("basicinfo/equipment_list");
                                    }
                                });
                            }
                        }.bind(this), function (error) {
                            console.log(error);
                        })
                    }
                } else {
                    console.log('error save!!');
                    return false;
                }
            });
        },
        //取消
        cancel: function () {
            loadDiv("basicinfo/equipment_list");
        }
    },

})