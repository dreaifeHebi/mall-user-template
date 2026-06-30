<template>
	<view class="container">
		<view class="header">
			<text class="title">{{ $t('help.title') }}</text>
		</view>
		
	<view class="content">
		<!-- 客户下单须知 -->
		<view class="help-section">
			<text class="section-title">{{ $t('help.orderNotice.title') }}</text>
			<view class="notice-list">
				<view class="notice-item">
					<text class="notice-text">{{ $t('help.orderNotice.item1') }}</text>
				</view>
				<view class="notice-item">
					<text class="notice-text">{{ $t('help.orderNotice.item2') }}</text>
				</view>
				<view class="notice-item">
					<text class="notice-text">{{ $t('help.orderNotice.item3') }}</text>
				</view>
				<view class="notice-item">
					<text class="notice-text">{{ $t('help.orderNotice.item4') }}</text>
				</view>
			</view>
		</view>
		
		<view class="help-section">
			<text class="section-title">{{ $t('help.faq') }}</text>
	
			<view class="faq-item" v-for="(item, index) in faqList" :key="index" @click="toggleFaq(index)">
					<view class="faq-question">
						<text class="question-text">{{$t(item.question)}}</text>
						<text class="question-icon yticon" :class="item.expanded ? 'icon-xiangshang' : 'icon-xiangxia'"></text>
					</view>
					<view class="faq-answer" v-if="item.expanded">
						<text class="answer-text">{{$t(item.answer)}}</text>
					</view>
				</view>
			</view>
			
			<view class="help-section">
				<text class="section-title">{{ $t('help.shoppingGuide') }}</text>
				
				<view class="guide-item" v-for="(item, index) in guideList" :key="index">
					<view class="guide-icon">
						<text class="yticon" :class="item.icon"></text>
					</view>
					<view class="guide-content">
						<text class="guide-name">{{$t(item.name)}}</text>
						<text class="guide-desc">{{$t(item.desc)}}</text>
					</view>
				</view>
			</view>
			
			<view class="contact-section">
				<text class="section-title">{{ $t('help.contactUs') }}</text>
				<text class="contact-desc">{{ $t('help.contactDesc') }}</text>
				
				<view class="contact-buttons">
					<view class="contact-btn" @click="navToContact">
						<text class="btn-text">{{ $t('help.contactService') }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { setPageTitle } from '@/utils/pageTitleUtil.js';
	export default {
		data() {
			return {
				faqList: [
					{
						question: 'help.faq1.question',
						answer: 'help.faq1.answer',
						expanded: false
					},
					{
						question: 'help.faq2.question',
						answer: 'help.faq2.answer',
						expanded: false
					},
					{
						question: 'help.faq3.question',
						answer: 'help.faq3.answer',
						expanded: false
					},
					{
						question: 'help.faq4.question',
						answer: 'help.faq4.answer',
						expanded: false
					},
					{
						question: 'help.faq5.question',
						answer: 'help.faq5.answer',
						expanded: false
					}
				],
				guideList: [
					{
						icon: 'icon-gouwuche',
						name: 'help.guide1.name',
						desc: 'help.guide1.desc'
					},
					{
						icon: 'icon-zhifu',
						name: 'help.guide2.name',
						desc: 'help.guide2.desc'
					},
					{
						icon: 'icon-wuliu',
						name: 'help.guide3.name',
						desc: 'help.guide3.desc'
					},
					{
						icon: 'icon-shouhou',
						name: 'help.guide4.name',
						desc: 'help.guide4.desc'
					}
				]
			};
		},
		onLoad() {
			setPageTitle('pageTitle.help');
		},
		methods: {
			toggleFaq(index) {
				this.faqList[index].expanded = !this.faqList[index].expanded;
			},
			
			navToContact() {
				uni.navigateTo({
					url: '/pages/contact/contact'
				});
			}
		}
	}
</script>

<style lang="scss">
	.container {
		background: #f5f5f5;
		min-height: 100vh;
	}
	
	.header {
		background: #fff;
		padding: 30upx;
		text-align: center;
		border-bottom: 1upx solid #e5e5e5;
		
		.title {
			font-size: 36upx;
			font-weight: 500;
			color: #000;
		}
	}
	
	.content {
		padding: 30upx;
	}
	
	.help-section, .contact-section {
		background: #fff;
		border-radius: 15upx;
		padding: 30upx;
		margin-bottom: 20upx;
		
		.section-title {
			font-size: 32upx;
			font-weight: 500;
			color: #000;
			margin-bottom: 20upx;
			display: block;
		}
	}
	
	.notice-list {
		.notice-item {
			padding: 15upx 0;
			border-bottom: 1upx solid #f5f5f5;
			
			&:last-child {
				border-bottom: none;
			}
			
			.notice-text {
				font-size: 28upx;
				color: #666;
				line-height: 1.6;
				display: block;
			}
		}
	}
	
	.faq-item {
		border-bottom: 1upx solid #f5f5f5;
		padding: 20upx 0;
		
		&:last-child {
			border-bottom: none;
		}
		
		.faq-question {
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.question-text {
				font-size: 30upx;
				color: #000;
				flex: 1;
			}
			
			.question-icon {
				font-size: 24upx;
				color: #999;
			}
		}
		
		.faq-answer {
			margin-top: 15upx;
			padding-top: 15upx;
			border-top: 1upx solid #f8f8f8;
			
			.answer-text {
				font-size: 28upx;
				color: #666;
				line-height: 1.6;
				display: block;
			}
		}
	}
	
	.guide-item {
		display: flex;
		align-items: center;
		padding: 20upx 0;
		border-bottom: 1upx solid #f5f5f5;
		
		&:last-child {
			border-bottom: none;
		}
		
		.guide-icon {
			width: 80upx;
			height: 80upx;
			border-radius: 50%;
			background: #f0f9ff;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 20upx;
			
			.yticon {
				font-size: 36upx;
				color: #409eff;
			}
		}
		
		.guide-content {
			flex: 1;
			
			.guide-name {
				font-size: 30upx;
				color: #000;
				margin-bottom: 5upx;
				display: block;
			}
			
			.guide-desc {
				font-size: 26upx;
				color: #666;
				display: block;
			}
		}
	}
	
	.contact-section {
		.contact-desc {
			font-size: 28upx;
			color: #666;
			margin-bottom: 30upx;
			display: block;
		}
		
		.contact-buttons {
			display: flex;
			justify-content: center;
			
			.contact-btn {
				background: #007aff;
				color: #fff;
				border-radius: 50upx;
				padding: 25upx 60upx;
				
				.btn-text {
					font-size: 30upx;
					color: #fff;
				}
			}
		}
	}
</style>
