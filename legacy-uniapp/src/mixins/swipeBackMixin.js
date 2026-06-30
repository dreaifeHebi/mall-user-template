/**
 * 手势返回Mixin
 * 实现从左边缘向右滑动返回上一页的功能
 */
export default {
	data() {
		return {
			swipeBack: {
				startX: 0,
				startY: 0,
				currentX: 0,
				moveCount: 0, // 移动次数计数
				isSwiping: false,
				isValidSwipe: false, // 是否是有效的滑动
				edgeThreshold: 50, // 左边缘触发区域宽度(px)
				minSwipeDistance: 80, // 最小滑动距离触发返回(px)
				maxYOffset: 50, // 最大Y轴偏移,超过则取消(px)
				moveThreshold: 3 // 需要移动的最小次数才确认为拖拽
			}
		};
	},
	
	mounted() {
		// 只在H5环境下启用
		// #ifdef H5
		this.initSwipeBack();
		// #endif
	},
	
	beforeDestroy() {
		// #ifdef H5
		this.destroySwipeBack();
		// #endif
	},
	
	methods: {
		initSwipeBack() {
			// 根据屏幕宽度动态设置滑动距离（屏幕宽度的1/4）
			this.swipeBack.minSwipeDistance = window.innerWidth / 4;
			
			// 创建返回提示元素
			this.createSwipeIndicator();
			
			// 绑定触摸事件
			document.addEventListener('touchstart', this.handleTouchStart, { passive: false });
			document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
			document.addEventListener('touchend', this.handleTouchEnd, { passive: false });
		},
		
		destroySwipeBack() {
			// 移除事件监听
			document.removeEventListener('touchstart', this.handleTouchStart);
			document.removeEventListener('touchmove', this.handleTouchMove);
			document.removeEventListener('touchend', this.handleTouchEnd);
			
			// 移除提示元素
			const indicator = document.getElementById('swipe-back-indicator');
			if (indicator) {
				indicator.remove();
			}
		},
		
		createSwipeIndicator() {
			// 检查是否已存在
			if (document.getElementById('swipe-back-indicator')) {
				return;
			}
			
			// 获取多语言文本
			const getText = () => {
				return this.$t ? this.$t('swipeBack.releaseToReturn') : '松手返回';
			};
			
			const indicator = document.createElement('div');
			indicator.id = 'swipe-back-indicator';
			indicator.innerHTML = `
				<div class="swipe-back-content">
					<svg class="swipe-back-arrow" viewBox="0 0 24 24" width="40" height="40">
						<path fill="currentColor" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
					</svg>
					<div class="swipe-back-text">${getText()}</div>
				</div>
			`;
			
			// 添加样式
			const style = document.createElement('style');
			style.textContent = `
				#swipe-back-indicator {
					position: fixed;
					left: 0;
					top: 0;
					width: 0;
					height: 100vh;
					background: linear-gradient(to right, rgba(0, 0, 0, 0.05), transparent);
					display: flex;
					align-items: center;
					justify-content: flex-start;
					padding-left: 20px;
					z-index: 9999;
					pointer-events: none;
					transition: opacity 0.2s;
					opacity: 0;
				}
				
				#swipe-back-indicator.active {
					opacity: 1;
				}
				
				#swipe-back-indicator.triggered {
					background: linear-gradient(to right, rgba(76, 175, 80, 0.15), transparent);
				}
				
				.swipe-back-content {
					display: flex;
					flex-direction: column;
					align-items: center;
					transform: translateX(-20px);
					transition: transform 0.3s;
				}
				
				#swipe-back-indicator.active .swipe-back-content {
					transform: translateX(0);
				}
				
				.swipe-back-arrow {
					color: #666;
					margin-bottom: 8px;
					transition: color 0.3s, transform 0.3s;
				}
				
				#swipe-back-indicator.triggered .swipe-back-arrow {
					color: #4CAF50;
					transform: scale(1.1);
				}
				
				.swipe-back-text {
					font-size: 14px;
					color: #666;
					white-space: nowrap;
					transition: color 0.3s;
				}
				
				#swipe-back-indicator.triggered .swipe-back-text {
					color: #4CAF50;
					font-weight: bold;
				}
			`;
			
			document.head.appendChild(style);
			document.body.appendChild(indicator);
			
			// 监听语言变化，更新文本
			if (this.$i18n && this.$i18n.locale) {
				this.$watch('$i18n.locale', () => {
					const textEl = document.querySelector('.swipe-back-text');
					if (textEl) {
						textEl.textContent = getText();
					}
				});
			}
		},
		
		handleTouchStart(e) {
			const touch = e.touches[0];
			this.swipeBack.startX = touch.clientX;
			this.swipeBack.startY = touch.clientY;
			this.swipeBack.currentX = touch.clientX;
			this.swipeBack.moveCount = 0;
			this.swipeBack.isValidSwipe = false;
			
			// 只在左边缘触发
			if (touch.clientX <= this.swipeBack.edgeThreshold) {
				this.swipeBack.isSwiping = true;
			}
		},
		
		handleTouchMove(e) {
			if (!this.swipeBack.isSwiping) {
				return;
			}
			
			const touch = e.touches[0];
			this.swipeBack.currentX = touch.clientX;
			this.swipeBack.moveCount++;
			
			const deltaX = touch.clientX - this.swipeBack.startX;
			const deltaY = Math.abs(touch.clientY - this.swipeBack.startY);
			
			// 增加移动次数阈值，确认是真正的拖拽
			if (this.swipeBack.moveCount >= this.swipeBack.moveThreshold) {
				this.swipeBack.isValidSwipe = true;
			}
			
			// Y轴偏移太大,取消滑动
			if (deltaY > this.swipeBack.maxYOffset && this.swipeBack.isValidSwipe) {
				this.hideIndicator();
				this.swipeBack.isSwiping = false;
				this.swipeBack.isValidSwipe = false;
				return;
			}
			
			// 只处理向右滑动且已确认为有效拖拽
			if (deltaX > 5 && this.swipeBack.isValidSwipe) {
				e.preventDefault(); // 阻止默认行为
				this.showIndicator(deltaX);
			} else if (deltaX <= 0) {
				this.hideIndicator();
			}
		},
		
		handleTouchEnd(e) {
			if (!this.swipeBack.isSwiping) {
				return;
			}
			
			const deltaX = this.swipeBack.currentX - this.swipeBack.startX;
			
			// 判断是否触发返回（需要是有效的滑动）
			if (deltaX >= this.swipeBack.minSwipeDistance && this.swipeBack.isValidSwipe) {
				this.performBack();
			}
			
			this.hideIndicator();
			this.swipeBack.isSwiping = false;
			this.swipeBack.isValidSwipe = false;
			this.swipeBack.moveCount = 0;
		},
		
		showIndicator(deltaX) {
			const indicator = document.getElementById('swipe-back-indicator');
			if (!indicator) {
				return;
			}
			
			// 设置宽度,最大为屏幕宽度的30%
			const maxWidth = window.innerWidth * 0.3;
			const width = Math.min(deltaX, maxWidth);
			
			indicator.style.width = `${width}px`;
			indicator.classList.add('active');
			
			// 判断是否达到触发阈值
			if (deltaX >= this.swipeBack.minSwipeDistance) {
				indicator.classList.add('triggered');
			} else {
				indicator.classList.remove('triggered');
			}
		},
		
		hideIndicator() {
			const indicator = document.getElementById('swipe-back-indicator');
			if (!indicator) {
				return;
			}
			
			indicator.style.width = '0';
			indicator.classList.remove('active', 'triggered');
		},
		
		performBack() {
			// 优先执行页面自定义的返回处理
			// 如果页面定义了 onSwipeBack 方法并返回 true，则表示已处理，拦截默认返回
			if (this.onSwipeBack && typeof this.onSwipeBack === 'function') {
				if (this.onSwipeBack()) {
					return;
				}
			}

			// 检查当前页面路由栈
			const pages = getCurrentPages();
			
			if (pages.length > 1) {
				// 有上一页,执行返回
				uni.navigateBack({
					delta: 1
				});
				return;
			}

			// 如果没有上一页，且当前不是首页，则返回首页
			// 获取当前页面路径
			const currentPage = pages[pages.length - 1];
			const currentRoute = currentPage ? currentPage.route : '';
			
			// 如果当前不是首页，则返回首页
			if (currentRoute && !currentRoute.includes('pages/index/index')) {
				uni.reLaunch({
					url: '/pages/index/index'
				});
			}
		}
	}
};
