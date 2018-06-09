import Vue from 'vue'
import Router from 'vue-router'

import Home from "@/pages/home";
import Qu_players from "@/pages/players/query_players";
import Ban from "@/pages/players/ban";
import Gossip from "@/pages/players/gossip";
import Addcurrency from "@/pages/players/add_currency";
import Send_P_mail from "@/pages/mail/send_personal_mail";
import Send_G_mail from "@/pages/mail/send_global_mail";
import Query_G_mail from "@/pages/mail/query_global_mail";
import Mail_approval from "@/pages/mail/mail_approval";
import Recharge from "@/pages/recharge/recharge";
import Recharge_approval from "@/pages/recharge/recharge_approval";
import Generate_code from "@/pages/activation-code/generate_code";
import Check_V_code from "@/pages/activation-code/check_valid_code";
import Check_code from "@/pages/activation-code/check_code";
import Query_radio from "@/pages/broadcast/query_radio";
import Send_radio from "@/pages/broadcast/send_radio";
import TW_query from "@/pages/test-welfare/query";
import TW_recharge from "@/pages/test-welfare/recharge_list";
import TW_upload from "@/pages/test-welfare/upload_list";
import Ser_reload_csv from "@/pages/server/reload_csv";
import Ser_reload_lua from "@/pages/server/reload_lua";
import Ser_setOpenTime from "@/pages/server/set_openserver_time";
import Ser_get_protocol_contr from "@/pages/server/get_protocol_controller";
import Ser_set_protocol_contr from "@/pages/server/set_protocol_controller";

Vue.use(Router);

export default new Router({
	routes: [{
		path: '/',
		redirect: '/query_players',
		name: 'Home',
		component: Home,
		children: [{
			path: "query_players",
			component: Qu_players,
			name: "查询玩家"
		}, {
			path: "ban",
			component: Ban,
			name: "封号"
		}, {
			path: "gossip",
			component: Gossip,
			name: "禁言"
		}, {
			path: "add_currency",
			component: Addcurrency,
			name: "添加货币"
		}, {
			path: "send_personal_mail",
			component: Send_P_mail,
			name: "发送个人邮件"
		}, {
			path: "send_global_mail",
			component: Send_G_mail,
			name: "发送全局邮件"
		}, {
			path: "query_global_mail",
			component: Query_G_mail,
			name: "查询全局邮件"
		}, {
			path: "mail_approval",
			component: Mail_approval,
			name: "邮件审批"
		}, {
			path: "recharge",
			component: Recharge,
			name: "虚拟充值"
		}, {
			path: "recharge_approval",
			component: Recharge_approval,
			name: "充值审批"
		}, {
			path: "generate_code",
			component: Generate_code,
			name:"生成激活码"
		}, {
			path: "check_valid_code",
			component: Check_V_code,
			name: "查询有效激活码"
		}, {
			path: "check_code",
			component: Check_code,
			name: "检测激活码"
		}, {
			path: "query_radio",
			component: Query_radio,
			name: "查询广播"
		}, {
			path: "send_radio",
			component: Send_radio,
			name: "发送广播"
		}, {
			path: "query_tw",
			component: TW_query,
			name: "查询礼包"
		}, {
			path: "upload_list",
			component: TW_upload,
			name: "上传测试反馈名单"
		}, {
			path: "recharge_list",
			component: TW_recharge,
			name: "上传测试充值名单"
		}, {
			path: "reload_csv",
			component: Ser_reload_csv,
			name: "重新加载CSV"
		}, {
			path: "reload_lua",
			component: Ser_reload_lua,
			name: "重新加载Lua"
		}, {
			path: "set_openserver_time",
			component: Ser_setOpenTime,
			name: "设置开服时间"
		}, {
			path: "get_protocol_controller",
			component: Ser_get_protocol_contr,
			name: "协议查询"
		}, {
			path: "set_protocol_controller",
			component: Ser_set_protocol_contr,
			name: "协议控制"
		}]
	}]
})
