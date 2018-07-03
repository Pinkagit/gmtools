import Vue from 'vue'
import vuex from "vuex";

Vue.use(vuex);

export default new vuex.Store({
    state: {
        isCollapse: false,      // 导航菜单折叠状态
        breadcrumb_title: [],    // 面包屑
        zoneid: [],              // serverlist
        includePageNames: []
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
        },
        add_includePN(state, name) {    // 添加 tag
            state.includePageNames.push(name);
        },
        remove_includePN(state, name) { // 移除 tag
            let index = state.includePageNames.indexOf(name);
            state.includePageNames.splice(index, 1);
        },
        remove_other_includePN(state, name) { // 移除其他 tag
            state.includePageNames = [name];     
        }
    }
})

