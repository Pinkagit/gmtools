import Vue from 'vue'
import vuex from "vuex";

Vue.use(vuex);

export default new vuex.Store({
    state: {
        isCollapse: false,      // 导航菜单折叠状态
        breadcrumb_title: [],    // 面包屑
        zoneid: [],              // serverlist
    },
    mutations: {
        changeCollapse (state) {                
            state.isCollapse = !state.isCollapse;
        },
        set_breadcrumb_title(state, title) {   
            state.breadcrumb_title = title;
        },
        change_checkbox_server(state, zoneid) {
            state.zoneid = zoneid;
        }
    }
})

