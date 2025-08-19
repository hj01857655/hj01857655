// ==UserScript==
// @name         GitHub 仓库删除助手
// @description  GitHub 仓库快速删除工具 - 提供安全的一键删除功能
// @version      1.0.0
// @author       您的用户名
// @namespace    http://github.com/
// @match        https://github.com/*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/your-username/your-repo/main/github-delete-helper.user.js
// ==/UserScript==

(() => {
  'use strict';

  // 配置
  const CONFIG = {
    confirmationRequired: true,
    safeMode: true,
    autoDelay: 1000, // 自动操作间隔时间(ms)
  };

  // 工具函数
  const $ = (selector) => document.querySelector(selector);
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const isRepoPage = () => /^\/[^\/]+\/[^\/]+\/?$/.test(location.pathname);
  const getRepoName = () => {
    const match = location.pathname.match(/^\/([^\/]+)\/([^\/]+)/);
    return match ? `${match[1]}/${match[2]}` : null;
  };

  // 样式
  GM_addStyle(`
    .github-delete-helper {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      background: #fff;
      border: 2px solid #d73a49;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 320px;
    }
    
    .github-delete-helper h3 {
      margin: 0 0 12px 0;
      color: #d73a49;
      font-size: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .github-delete-helper p {
      margin: 0 0 16px 0;
      color: #586069;
      font-size: 14px;
      line-height: 1.4;
    }
    
    .github-delete-helper .repo-name {
      background: #f6f8fa;
      padding: 4px 8px;
      border-radius: 4px;
      font-family: ui-monospace, monospace;
      font-size: 13px;
      color: #24292e;
      font-weight: 600;
    }
    
    .github-delete-helper .buttons {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    
    .github-delete-helper button {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    
    .github-delete-helper .btn-cancel {
      background: #f6f8fa;
      color: #24292e;
      border: 1px solid #d1d9e0;
    }
    
    .github-delete-helper .btn-cancel:hover {
      background: #e1e4e8;
    }
    
    .github-delete-helper .btn-delete {
      background: #d73a49;
      color: #fff;
    }
    
    .github-delete-helper .btn-delete:hover {
      background: #cb2431;
    }
    
    .github-delete-helper .btn-delete:disabled {
      background: #ffeef0;
      color: #d73a49;
      cursor: not-allowed;
    }
    
    .github-delete-helper .progress {
      margin: 12px 0;
      padding: 8px 12px;
      background: #fff5b4;
      border: 1px solid #d9d0a5;
      border-radius: 4px;
      font-size: 13px;
      color: #735c0f;
    }
    
    .github-delete-helper .error {
      margin: 12px 0;
      padding: 8px 12px;
      background: #ffeef0;
      border: 1px solid #fdaeb7;
      border-radius: 4px;
      font-size: 13px;
      color: #d73a49;
    }
    
    .github-delete-helper .success {
      margin: 12px 0;
      padding: 8px 12px;
      background: #dcffe4;
      border: 1px solid #abd7c0;
      border-radius: 4px;
      font-size: 13px;
      color: #22863a;
    }
  `);

  // 删除助手类
  class GitHubDeleteHelper {
    constructor() {
      this.repoName = getRepoName();
      this.isDeleting = false;
      this.ui = null;
    }

    // 显示确认对话框
    showConfirmDialog() {
      if (this.ui) return;

      this.ui = document.createElement('div');
      this.ui.className = 'github-delete-helper';
      this.ui.innerHTML = `
        <h3>⚠️ 删除仓库确认</h3>
        <p>您即将删除仓库：<br><span class="repo-name">${this.repoName}</span></p>
        <p><strong>警告：</strong>此操作不可逆转！仓库的所有数据将永久丢失。</p>
        <div class="buttons">
          <button class="btn-cancel" id="cancel-delete">取消</button>
          <button class="btn-delete" id="confirm-delete">确认删除</button>
        </div>
      `;

      document.body.appendChild(this.ui);

      // 绑定事件
      $('#cancel-delete').onclick = () => this.hideDialog();
      $('#confirm-delete').onclick = () => this.startDelete();

      // ESC 键取消
      const handleKeydown = (e) => {
        if (e.key === 'Escape') {
          this.hideDialog();
          document.removeEventListener('keydown', handleKeydown);
        }
      };
      document.addEventListener('keydown', handleKeydown);
    }

    // 隐藏对话框
    hideDialog() {
      if (this.ui) {
        this.ui.remove();
        this.ui = null;
      }
    }

    // 显示进度信息
    showProgress(message) {
      if (!this.ui) return;

      const existing = this.ui.querySelector('.progress, .error, .success');
      if (existing) existing.remove();

      const progress = document.createElement('div');
      progress.className = 'progress';
      progress.textContent = message;
      this.ui.querySelector('.buttons').before(progress);
    }

    // 显示错误信息
    showError(message) {
      if (!this.ui) return;

      const existing = this.ui.querySelector('.progress, .error, .success');
      if (existing) existing.remove();

      const error = document.createElement('div');
      error.className = 'error';
      error.textContent = message;
      this.ui.querySelector('.buttons').before(error);

      this.isDeleting = false;
      $('#confirm-delete').disabled = false;
      $('#confirm-delete').textContent = '确认删除';
    }

    // 显示成功信息
    showSuccess(message) {
      if (!this.ui) return;

      const existing = this.ui.querySelector('.progress, .error, .success');
      if (existing) existing.remove();

      const success = document.createElement('div');
      success.className = 'success';
      success.textContent = message;
      this.ui.querySelector('.buttons').before(success);

      setTimeout(() => this.hideDialog(), 2000);
    }

    // 开始删除流程
    async startDelete() {
      if (this.isDeleting) return;

      this.isDeleting = true;
      $('#confirm-delete').disabled = true;
      $('#confirm-delete').textContent = '删除中...';

      try {
        await this.executeDeleteSteps();
      } catch (error) {
        console.error('删除失败:', error);
        this.showError(`删除失败: ${error.message}`);
      }
    }

    // 执行删除步骤
    async executeDeleteSteps() {
      // 步骤1: 点击设置标签
      this.showProgress('正在打开设置页面...');
      const settingBtn = $('#settings-tab');
      if (!settingBtn) {
        throw new Error('未找到设置标签，请确保在仓库页面');
      }
      settingBtn.click();
      await sleep(CONFIG.autoDelay);

      // 步骤2: 点击删除仓库按钮
      this.showProgress('正在查找删除选项...');
      await sleep(1000); // 等待页面加载

      const deleteBtn = $('#dialog-show-repo-delete-menu-dialog');
      if (!deleteBtn) {
        throw new Error('未找到删除仓库按钮，请检查权限');
      }
      deleteBtn.click();
      await sleep(CONFIG.autoDelay);

      // 步骤3: 确认删除意图
      this.showProgress('正在确认删除意图...');
      const deleteBtn2 = $('#repo-delete-proceed-button');
      if (!deleteBtn2) {
        throw new Error('未找到确认按钮');
      }
      deleteBtn2.click();
      await sleep(CONFIG.autoDelay);

      // 步骤4: 确认已阅读警告
      this.showProgress('正在确认警告信息...');
      const deleteBtn3 = $('#repo-delete-proceed-button');
      if (!deleteBtn3) {
        throw new Error('未找到第二个确认按钮');
      }
      deleteBtn3.click();
      await sleep(CONFIG.autoDelay);

      // 步骤5: 输入验证文本并最终删除
      this.showProgress('正在输入验证信息...');
      const verField = $('#verification_field');
      if (!verField) {
        throw new Error('未找到验证输入框');
      }

      const verText = verField.dataset.repoNwo;
      if (!verText) {
        throw new Error('无法获取验证文本');
      }

      verField.value = verText;
      verField.dispatchEvent(new Event('input', { bubbles: true }));
      await sleep(500);

      const deleteFinalBtn = $('#repo-delete-proceed-button');
      if (!deleteFinalBtn) {
        throw new Error('未找到最终删除按钮');
      }

      deleteFinalBtn.disabled = false;
      deleteFinalBtn.click();

      this.showSuccess('仓库删除成功！页面即将跳转...');
    }
  }

  // 初始化
  function init() {
    // 只在仓库页面运行
    if (!isRepoPage()) return;

    // 注册菜单命令
    GM_registerMenuCommand('🗑️ 删除当前仓库', () => {
      const helper = new GitHubDeleteHelper();
      helper.showConfirmDialog();
    });

    // 添加快捷键支持 (Ctrl+Shift+D)
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        const helper = new GitHubDeleteHelper();
        helper.showConfirmDialog();
      }
    });

    console.log('GitHub 仓库删除助手已加载');
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
