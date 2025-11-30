// CatState は新プロジェクトでは使用しない（セッション管理はNext.js側で行う）
// import { CatState } from './session';
import { apiClient } from '@/infrastructure/api/ApiClient';
import { logError, logWarn } from './log';

export interface SaveResult {
  success: boolean;
  error?: string;
}

export interface LoadResult {
  success: boolean;
  catState?: any | null; // CatState を any に変更
  catName?: string | null;
  error?: string;
}

export interface StateSaverConfig {
  autoSave: boolean;
  autoSaveInterval: number; // milliseconds
  retryAttempts: number;
  retryDelay: number; // milliseconds
}

export class StateSaver {
  private config: StateSaverConfig;
  private autoSaveTimer: NodeJS.Timeout | null = null;
  private pendingSave: Promise<SaveResult> | null = null;

  constructor() {
    this.config = {
      autoSave: false,
      autoSaveInterval: 30000, // 30秒
      retryAttempts: 3,
      retryDelay: 1000 // 1秒
    };
  }

  async saveCatState(catState: any): Promise<SaveResult> { // CatState を any に変更
    try {
      if (this.pendingSave) {
        await this.pendingSave;
      }

      this.pendingSave = this.saveWithRetry(catState);
      const result = await this.pendingSave;
      this.pendingSave = null;

      return result;
    } catch (error) {
      logError('Failed to save cat state', { error: error instanceof Error ? error.message : String(error) });
      return {
        success: false,
        error: error instanceof Error ? error.message : '保存に失敗しました'
      };
    }
  }

  async loadCatState(): Promise<LoadResult> {
    // getCatState() は新プロジェクトでは使用しない
    try {
      // const response = await apiClient.getCatState();

      // 新プロジェクトでは常に空の状態を返す
      return {
        success: true,
        catState: null,
        catName: null
      };

      /*
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }

      return {
        success: true,
        catState: response.data?.catState || null,
        catName: response.data?.catName || null
      };
      */
    } catch (error) {
      logError('Failed to load cat state', { error: error instanceof Error ? error.message : String(error) });
      return {
        success: false,
        error: error instanceof Error ? error.message : '読み込みに失敗しました'
      };
    }
  }

  startAutoSave(getCurrentState: () => any | null): void { // CatState を any に変更
    if (this.autoSaveTimer) {
      this.stopAutoSave();
    }

    if (!this.config.autoSave) return;

    this.autoSaveTimer = setInterval(async () => {
      const currentState = getCurrentState();
      if (currentState) {
        const result = await this.saveCatState(currentState);
        if (!result.success) {
          logWarn('Auto-save failed', { error: result.error });
        }
      }
    }, this.config.autoSaveInterval);
  }

  stopAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  async saveGameEnd(finalCatState: any): Promise<SaveResult> { // CatState を any に変更
    this.stopAutoSave();

    if (this.pendingSave) {
      await this.pendingSave;
    }

    return this.saveCatState(finalCatState);
  }

  updateConfig(newConfig: Partial<StateSaverConfig>): void {
    const wasAutoSaveEnabled = this.config.autoSave;
    this.config = { ...this.config, ...newConfig };

    if (wasAutoSaveEnabled && !this.config.autoSave) {
      this.stopAutoSave();
    }
  }

  getConfig(): StateSaverConfig {
    return { ...this.config };
  }

  private async saveWithRetry(catState: any): Promise<SaveResult> { // CatState を any に変更
    // saveCatState() は新プロジェクトでは使用しない
    // 新プロジェクトでは常に成功を返す
    return { success: true };

    /*
    let lastError: string | undefined;

    for (let attempt = 0; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const response = await apiClient.saveCatState(catState);

        if (response.success) {
          return { success: true };
        }

        lastError = response.error;

        if (attempt < this.config.retryAttempts) {
          await this.delay(this.config.retryDelay * (attempt + 1));
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : '通信エラー';

        if (attempt < this.config.retryAttempts) {
          await this.delay(this.config.retryDelay * (attempt + 1));
        }
      }
    }

    return {
      success: false,
      error: lastError || '保存に失敗しました'
    };
    */
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async waitForPendingSave(): Promise<void> {
    if (this.pendingSave) {
      await this.pendingSave;
    }
  }

  hasPendingSave(): boolean {
    return this.pendingSave !== null;
  }
}