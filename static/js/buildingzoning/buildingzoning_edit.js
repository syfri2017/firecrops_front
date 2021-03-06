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
            //队站类型
            jzlxData: [],
            //qk
            jzl_jzqkData: [],
            jzl_jzsyxzData: [],
            cgData: [],
            jzl_jzjgData: [],
            zzl_jzjgData: [],
            //上级队站
            sjdzData: [],
            //行政区划
            xzqhData: [],
            //角色
            shiroData: [],
            //建筑属性
            isJzl: false,
            isZzl: false,
            isCgl: false,
            //储罐设定
            dynamicValidateForm: [],
            //编辑表单
            editForm: {
                //单位建筑新增
                jzmc: "",
                jzwz: "",
                lon: "",
                lat: "",
                xqxclx: "",
                yjddsc: "",
                bz: "",
                //创建人、修改人
                cjrid: "",
                cjrmc: "",
                xgrid: "",
                xgrmc: "",
                jzlx: "",
                // buildingVO: {}

                //建筑类
                jzl_jzid: "",
                jzl_jzqk: "",
                jzl_jzsyxz: "",
                jzl_jzjg: "",
                jzl_gnms: "",
                jzl_zdmj: "",
                jzl_jzmj: "",
                jzl_dsgd: "",
                jzl_dxgd: "",
                jzl_dscs: "",
                //装置类
                zzl_jzid: "",
                zzl_jzjg: "",
                zzl_zdmj: "",
                zzl_zzgd: "",
                zzl_jsfzr: "",
                zzl_jsfzrdh: "",
                zzl_zzzc: "",
                zzl_ylxx: "",
                zzl_cwxx: "",
                zzl_gylc: "",
                //储罐类
                cgl_jzid: "",
                cgl_zrj: "",
                cgl_cgsl: "",
                cgl_cgjg: "",
                cgl_ccjzms: "",
                cgl_jsfzr: "",
                cgl_jsfzrdh: "",
                cgl_plqkd: "",
                cgl_plqkx: "",
                cgl_plqkn: "",
                cgl_plqkb: "",
                chuguanList: [{
                    sjlx: 'JZ',
                    cgmc: "",
                    cglx: "",
                    cgrl: "",
                    cgzj: "",
                    cggd: "",
                    cgzc: "",
                    gdmj: "",
                    gzyl: "",
                    ccwd: "",
                    ccjzmc: "",
                    ccjzlhxz: "",
                    ccjzsjcl: "",
                    ccjzywgd: "",
                    bz: ""
                }]
            },

            editFormRules: {
                jzmc: [
                    { required: true, message: '请输入建筑名称', trigger: 'blur' }
                ],

                jzlx: [
                    { required: true, message: '请选择建筑类型', trigger: 'change' }
                ]
            },

            props: {
                value: 'codeValue',
                label: 'codeName',
                children: 'children'
            },

        }
    },
    created: function () {
        this.status = getQueryString("ID");
        /**面包屑 by zjc 20180801*/
        var type = getQueryString("type");
        if (type == "XZ") {
            loadBreadcrumb("单位建筑信息", "单位建筑信息新增");
        } else if (type == "BJ") {
            loadBreadcrumb("单位建筑信息", "单位建筑信息编辑");
        }
        this.searchClick('click');
        this.shiroData = shiroGlobal;

        //建筑类型下拉框
        this.getJzlxData();
        this.getJzqkData();
        this.getJzsyxzData();
        this.getJzjgData();
        this.getZzljzjgata();
        this.getCgData();
    },
    methods: {
        // handleNodeClick(data) {
        // },
        //建筑类型下拉框
        getJzlxData: function () {
            axios.get('/api/codelist/getCodetype/JZLX').then(function (res) {
                this.jzlxData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //jzqkData
        getJzqkData: function () {
            axios.get('/api/codelist/getCodetype/JZQK').then(function (res) {
                this.jzl_jzqkData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //jzsyxzData
        getJzsyxzData: function () {
            axios.get('/api/codelist/getDzlxTree/JZSYXZ').then(function (res) {
                this.jzl_jzsyxzData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //cgData
        getCgData: function () {
            axios.get('/api/codelist/getDzlxTree/CGLX').then(function (res) {
                this.cgData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //jzjgData
        getJzjgData: function () {
            axios.get('/api/codelist/getCodetype/JZJG').then(function (res) {
                this.jzl_jzjgData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //zzl_jzjgData
        getZzljzjgata: function () {
            axios.get('/api/codelist/getCodetype/JZJG').then(function (res) {
                this.zzl_jzjgData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //初始化查询事件
        searchClick: function (type) {
            this.loading = true;
            if (this.status == 0) {  //新增
                this.loading = false;
            } else {//修改
                var jzlxParam = getQueryString("jzlx");
                var params = {
                    jzid: this.status,
                    jzlx: jzlxParam
                };
                axios.post('/dpapi/building/findFqDetailByVo', params).then(function (res) {
                    this.editForm = res.data.result;
                    var type = this.editForm.jzlx;
                    if (this.editForm.jzl_jzsyxz != '' && this.editForm.jzl_jzsyxz != null) {
                        if (this.editForm.jzl_jzsyxz.endsWith("000")) {
                            var xzqh = this.editForm.jzl_jzsyxz;
                            this.editForm.jzl_jzsyxz = [];
                            this.editForm.jzl_jzsyxz.push(xzqh);
                        } else {
                            var xzqh1 = this.editForm.jzl_jzsyxz.substring(0, 1) + '000';
                            var xzqh2 = this.editForm.jzl_jzsyxz;
                            this.editForm.jzl_jzsyxz = [];
                            this.editForm.jzl_jzsyxz.push(xzqh1, xzqh2);
                        }
                    } else {
                        this.editForm.jzl_jzsyxz = [];
                    }
                    if (this.editForm.chuguanList != null) {
                        for (i = 0; i < this.editForm.chuguanList.length; i++) {
                            if (this.editForm.chuguanList[i].cglx != '' && this.editForm.chuguanList[i].cglx != null) {
                                if (this.editForm.chuguanList[i].cglx.endsWith("000")) {
                                    var xzqh = this.editForm.chuguanList[i].cglx;
                                    this.editForm.chuguanList[i].cglx = [];
                                    this.editForm.chuguanList[i].cglx.push(xzqh);
                                } else {
                                    var xzqh1 = this.editForm.chuguanList[i].cglx.substring(0, 1) + '000';
                                    var xzqh2 = this.editForm.chuguanList[i].cglx;
                                    this.editForm.chuguanList[i].cglx = [];
                                    this.editForm.chuguanList[i].cglx.push(xzqh1, xzqh2);
                                }
                            } else {
                                this.editForm.chuguanList[i].cglx = [];
                            }
                        }
                    } else {
                        this.editForm.chuguanList = [];
                    }

                    if (type == "10" || type == "20") {
                        this.isJzl = true;
                    } else if (type == "30") {
                        this.isZzl = true;
                    } else if (type == "40") {
                        this.isCgl = true;
                    } else {
                        this.isJzl = false;
                        this.isZzl = false;
                        this.isCgl = false;
                    }
                    this.loading = false;
                }.bind(this), function (error) {
                    console.log(error);
                })
            }
        },
        //保存前校验
        validateSave: function () {
            if (this.editForm.jzmc == "" || this.editForm.jzmc == null) {
                this.$message.warning({
                    message: '请输入建筑名称',
                    showClose: true
                });
                return false;
            } else if (this.editForm.jzlx == "" || this.editForm.jzlx == null) {
                this.$message.warning({
                    message: '请选择建筑类型',
                    showClose: true
                });
                return false;
            }
            return true;
        },
        //罐体增加
        addDomain: function () {
            this.editForm.chuguanList.push({
                sjlx: 'JZ',
                cgmc: "",
                cglx: "",
                cgrl: "",
                cgzj: "",
                cggd: "",
                cgzc: "",
                gdmj: "",
                gzyl: "",
                ccwd: "",
                ccjzmc: "",
                ccjzlhxz: "",
                ccjzsjcl: "",
                ccjzywgd: "",
                bz: ""
            });
        },
        //储罐删除
        removeDomain: function (item) {
            var index = this.editForm.chuguanList.indexOf(item)
            if (index !== -1) {
                this.editForm.chuguanList.splice(index, 1)
            }
        },
        //保存
        save: function (editForm) {
            
            this.$refs[editForm].validate((valid) => {
                if (valid) {
                    if (this.status == 0) {//新增
                        this.editForm.cjrid = this.shiroData.userid;
                        this.editForm.cjrmc = this.shiroData.realName;
                        this.editForm.jdh = this.shiroData.organizationVO.jgid.substr(0, 2) + '000000';
                        this.editForm.datasource = this.shiroData.organizationVO.jgid;
                        if (this.editForm.jzl_jzsyxz != null && this.editForm.jzl_jzsyxz.length > 0) {
                            this.editForm.jzl_jzsyxz = this.editForm.jzl_jzsyxz[this.editForm.jzl_jzsyxz.length - 1];
                        } else {
                            this.editForm.jzl_jzsyxz = '';
                        }
                        if (this.editForm.chuguanList != null) {
                            for (i = 0; i < this.editForm.chuguanList.length; i++) {
                                if (this.editForm.chuguanList[i].cglx.length > 0) {
                                    this.editForm.chuguanList[i].cglx = this.editForm.chuguanList[i].cglx[this.editForm.chuguanList[i].cglx.length - 1];
                                } else {
                                    this.editForm.chuguanList[i].cglx = '';
                                }
                            }
                        } else {
                            this.editForm.chuguanList = [];
                        }

                        axios.post('/dpapi/building/insertByVO', this.editForm).then(function (res) {
                            if (res.data.result == 1) {
                                this.$alert('成功保存单位建筑信息', '提示', {
                                    type: 'success',
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        loadDiv("buildingzoning/buildingzoning_list");
                                    }
                                });
                            } else {
                                this.$alert('保存失败', '提示', {
                                    type: 'error',
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        loadDiv("buildingzoning/buildingzoning_list");
                                    }
                                });
                            }
                        }.bind(this), function (error) {
                            console.log(error);
                        })
                        // }
                    } else {//修改

                        this.editForm.xgrid = this.shiroData.userid;
                        this.editForm.xgrmc = this.shiroData.realName;
                        if (this.editForm.jzl_jzsyxz != null && this.editForm.jzl_jzsyxz.length > 0) {
                            this.editForm.jzl_jzsyxz = this.editForm.jzl_jzsyxz[this.editForm.jzl_jzsyxz.length - 1];
                        } else {
                            this.editForm.jzl_jzsyxz = '';
                        }
                        if (this.editForm.chuguanList != null) {
                            for (i = 0; i < this.editForm.chuguanList.length; i++) {
                                if (this.editForm.chuguanList[i].cglx.length > 0) {
                                    this.editForm.chuguanList[i].cglx = this.editForm.chuguanList[i].cglx[this.editForm.chuguanList[i].cglx.length - 1];
                                } else {
                                    this.editForm.chuguanList[i].cglx = '';
                                }
                            }
                        } else {
                            this.editForm.chuguanList = [];
                        }

                        axios.post('/dpapi/building/doUpdateBuildingzoning', this.editForm).then(function (res) {
                            if (res.data.result != null) {
                                this.$alert('成功修改单位建筑信息', '提示', {
                                    type: 'success',
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        loadDiv("buildingzoning/buildingzoning_list");
                                    }
                                });
                            } else {
                                this.$alert('修改失败', '提示', {
                                    type: 'error',
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        loadDiv("buildingzoning/buildingzoning_list");
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
        cancel: function () {
            loadDiv("buildingzoning/buildingzoning_list");
        },
        //建筑类型变化
        jzlxChange: function () {
            var type = this.editForm.jzlx;
            if (type == "10" || type == "20") {
                if (type == "10") {
                    this.editForm.jzl_jzqk = '1'
                } else if (type == "20") {
                    this.editForm.jzl_jzqk = '2'
                }
                this.isJzl = true;
                this.isZzl = false;
                this.isCgl = false;
            } else if (type == "30") {
                this.isJzl = false;
                this.isZzl = true;
                this.isCgl = false;
            } else if (type == "40") {
                this.isJzl = false;
                this.isZzl = false;
                this.isCgl = true;
            } else {
                this.isJzl = false;
                this.isZzl = false;
                this.isCgl = false;
            }
        }
    },

})