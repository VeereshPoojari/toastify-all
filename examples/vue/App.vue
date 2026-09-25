
<template>
  <div class="container" :class="{ dark: theme === 'dark' }">
    <div class="content">
      <h1>🔔 Notification-All Vue Example</h1>
      <p>Click the buttons below to see different types of notifications:</p>
      
      <div class="buttons">
        <button class="success" @click="showSuccess">Success</button>
        <button class="error" @click="showError">Error</button>
        <button class="warning" @click="showWarning">Warning</button>
        <button class="info" @click="showInfo">Info</button>
        <button class="loading" @click="showLoading">
          {{ loadingId ? 'Complete Loading' : 'Loading' }}
        </button>
        <button class="config" @click="toggleTheme">Toggle Theme</button>
        <button class="clear" @click="clearAll">Clear All</button>
      </div>

      <div>
        <h3>Available Positions:</h3>
        <div class="buttons">
          <button 
            v-for="pos in positions" 
            :key="pos"
            :class="{ active: position === pos }"
            @click="changePosition(pos)"
          >
            {{ pos }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useNotifications } from 'notification-all/vue';

export default {
  name: 'App',
  setup() {
    const notify = useNotifications();
    return { notify };
  },
  data() {
    return {
      theme: 'light',
      position: 'top-right',
      loadingId: null,
      positions: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']
    };
  },
  methods: {
    showSuccess() {
      this.$toast.success('✅ Vue operation successful!');
    },
    showError() {
      this.$toast.error('❌ Vue error occurred!');
    },
    showWarning() {
      this.$toast.warn('⚠️ Vue warning message!');
    },
    showInfo() {
      this.$toast.info('ℹ️ Vue info message!');
    },
    showLoading() {
      if (this.loadingId) {
        this.$toast.update(this.loadingId, {
          type: 'success',
          message: '✅ Vue loading completed!'
        });
        this.loadingId = null;
      } else {
        this.loadingId = this.$toast.loading('🔄 Vue processing...');
        
        setTimeout(() => {
          this.$toast.update(this.loadingId, {
            type: 'success',
            message: '✅ Vue processing completed!'
          });
          this.loadingId = null;
        }, 3000);
      }
    },
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      this.$toast.configure({ theme: this.theme });
      this.$toast.info(`Switched to ${this.theme} theme`);
    },
    changePosition(newPosition) {
      this.position = newPosition;
      this.$toast.configure({ position: newPosition });
      this.$toast.info(`Position changed to ${newPosition}`);
    },
    clearAll() {
      this.$toast.clearAll();
    }
  }
};
</script>

<style>
.container {
  padding: 20px;
  font-family: Arial, sans-serif;
  background: #f5f5f5;
  color: #1f2937;
  min-height: 100vh;
}

.container.dark {
  background: #1f2937;
  color: #f9fafb;
}

.content {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.container.dark .content {
  background: #374151;
}

.buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: white;
}

.success { background: #10b981; }
.error { background: #ef4444; }
.warning { background: #f59e0b; }
.info { background: #3b82f6; }
.loading { background: #6b7280; }
.config { background: #8b5cf6; }
.clear { background: #374151; }
button.active { background: #10b981 !important; }
</style>