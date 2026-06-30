import request from '@/utils/requestUtil'

export function memberLogin(data) {
	return request({
		method: 'POST',
		url: '/sso/login',
		header: {
			'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
		},
		data: data
	})
}

export function memberInfo() {
	return request({
		method: 'GET',
		url: '/sso/info'
	})
}

// 用户注册
export function memberRegister(data) {
	return request({
		method: 'POST',
		url: '/sso/register/json',
		header: {
			'content-type': 'application/json'
		},
		data: data
	})
}

// 发送密码重置邮件
export function sendResetPasswordEmail(data) {
	return request({
		method: 'POST',
		url: '/sso/resetPassword',
		header: {
			'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
		},
		data: data
	})
}

// 重置密码确认
export function confirmResetPassword(data) {
	return request({
		method: 'POST',
		url: '/sso/resetPassword/confirm',
		header: {
			'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
		},
		data: data
	})
}

// 修改密码（需要登录）
export function updatePassword(data) {
	return request({
		method: 'POST',
		url: '/sso/updatePassword',
		header: {
			'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
		},
		data: data
	})
}

// 刷新Token
export function refreshToken() {
	return request({
		method: 'GET',
		url: '/sso/refreshToken'
	})
}

// 邮箱确认
export function confirmEmail(token) {
	return request({
		method: 'GET',
		url: '/confirm-email',
		params: { token }
	})
}

// 发送邮箱验证邮件
export function sendEmailVerification(email) {
	return request({
		method: 'POST',
		url: '/sso/sendEmailVerification',
		header: {
			'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
		},
		data: { email }
	})
}

// 更新会员信息
export function updateMemberInfo(data) {
	return request({
		method: 'POST',
		url: '/sso/updateInfo',
		header: {
			'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
		},
		data: data
	})
}
