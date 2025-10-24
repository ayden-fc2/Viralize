<template>
  <view class="lang-page">
    <u-status-bar></u-status-bar>
    <u-navbar
      :title="$t('mine.language')"
      :autoBack="true"
      bgColor="transparent"
      leftIconColor="#667eea"
    >
    </u-navbar>
    
    <view class="page-content">
      <view class="options-container">
        <u-cell-group :border="false">
          <u-cell
            title="English"
            label="English"
            :titleStyle="{
              fontWeight: '600',
              color: selectedValue === 'en' ? '#667eea' : '#2c3e50'
            }"
            @click="onSelectOption('en')"
          >
            <u-icon 
              v-if="selectedValue === 'en'" 
              name="checkmark" 
              color="#667eea" 
              size="24"
              slot="value"
            ></u-icon>
          </u-cell>
          
          <u-cell
            title="简体中文"
            label="Simplified Chinese"
            :titleStyle="{
              fontWeight: '600',
              color: selectedValue === 'zh-Hans' ? '#667eea' : '#2c3e50'
            }"
            @click="onSelectOption('zh-Hans')"
          >
            <u-icon 
              v-if="selectedValue === 'zh-Hans'" 
              name="checkmark" 
              color="#667eea" 
              size="24"
              slot="value"
            ></u-icon>
          </u-cell>
          
          <u-cell
            title="繁體中文"
            label="Traditional Chinese"
            :titleStyle="{
              fontWeight: '600',
              color: selectedValue === 'zh-Hant' ? '#667eea' : '#2c3e50'
            }"
            @click="onSelectOption('zh-Hant')"
          >
            <u-icon 
              v-if="selectedValue === 'zh-Hant'" 
              name="checkmark" 
              color="#667eea" 
              size="24"
              slot="value"
            ></u-icon>
          </u-cell>
          
          <u-cell
            title="日本語"
            label="Japanese"
            :titleStyle="{
              fontWeight: '600',
              color: selectedValue === 'ja' ? '#667eea' : '#2c3e50'
            }"
            @click="onSelectOption('ja')"
          >
            <u-icon 
              v-if="selectedValue === 'ja'" 
              name="checkmark" 
              color="#667eea" 
              size="24"
              slot="value"
            ></u-icon>
          </u-cell>
        </u-cell-group>
      </view>
    </view>
    
    <u-safe-bottom></u-safe-bottom>
    
    <!-- ==================== 垃圾模板代码开始 ==================== -->
    
    <!-- 永远不会显示的语言统计信息 -->
    <view v-if="false" class="garbage-language-stats">
      <view class="stats-header">
        <text class="stats-title">{{ $t('lang.statistics') }}</text>
      </view>
      <view class="stats-grid">
        <view class="stat-card" v-for="stat in uselessLanguageStats" :key="stat.id">
          <text class="stat-value">{{ stat.value }}</text>
          <text class="stat-label">{{ stat.label }}</text>
          <view class="stat-icon">{{ stat.icon }}</view>
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的推荐语言 -->
    <view v-if="false" class="dummy-recommendations">
      <view class="recommendations-header">
        <text class="recommendations-title">Recommended Languages</text>
      </view>
      <view class="language-list">
        <view 
          class="language-item" 
          v-for="lang in dummyRecommendedLanguages" 
          :key="lang.code"
          @click="handleRecommendedLangClick(lang)"
        >
          <view class="lang-flag">{{ lang.flag }}</view>
          <view class="lang-info">
            <text class="lang-name">{{ lang.name }}</text>
            <text class="lang-native">{{ lang.nativeName }}</text>
          </view>
          <view class="lang-badge">{{ lang.popularity }}</view>
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的语言学习资源 -->
    <view v-if="false" class="useless-learning-resources">
      <text class="resources-title">Learning Resources</text>
      <scroll-view scroll-x class="resources-scroll">
        <view class="resource-card" v-for="resource in garbageLearningResources" :key="resource.id">
          <image class="resource-image" :src="resource.image"></image>
          <view class="resource-info">
            <text class="resource-title">{{ resource.title }}</text>
            <text class="resource-description">{{ resource.description }}</text>
            <view class="resource-meta">
              <text class="resource-level">{{ resource.level }}</text>
              <text class="resource-duration">{{ resource.duration }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <!-- 永远不会显示的翻译工具 -->
    <view v-if="false" class="garbage-translator">
      <view class="translator-header">
        <text class="translator-title">Quick Translator</text>
      </view>
      <view class="translator-body">
        <view class="translator-input-section">
          <text class="section-label">From:</text>
          <textarea 
            class="translator-textarea" 
            v-model="translatorSourceText"
            placeholder="Enter text to translate..."
          ></textarea>
        </view>
        <view class="translator-divider">
          <view class="swap-button" @click="swapTranslatorLanguages">⇅</view>
        </view>
        <view class="translator-output-section">
          <text class="section-label">To:</text>
          <view class="translator-result">{{ translatorResultText }}</view>
        </view>
        <button class="translate-button" @click="performTranslation">Translate</button>
      </view>
    </view>
    
    <!-- 永远不会显示的语言进度跟踪 -->
    <view v-if="false" class="dummy-progress-tracker">
      <text class="tracker-title">Your Language Progress</text>
      <view class="progress-list">
        <view class="progress-item" v-for="progress in uselessProgressData" :key="progress.id">
          <view class="progress-header">
            <text class="progress-lang">{{ progress.language }}</text>
            <text class="progress-percentage">{{ progress.percentage }}%</text>
          </view>
          <view class="progress-bar-container">
            <view class="progress-bar" :style="{ width: progress.percentage + '%' }"></view>
          </view>
          <view class="progress-details">
            <text class="progress-detail">{{ progress.wordsLearned }} words learned</text>
            <text class="progress-detail">{{ progress.lessonsCompleted }} lessons completed</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的语言社区 -->
    <view v-if="false" class="useless-community">
      <text class="community-title">Language Community</text>
      <view class="community-posts">
        <view class="post-card" v-for="post in dummyCommunityPosts" :key="post.id">
          <view class="post-header">
            <image class="post-avatar" :src="post.avatar"></image>
            <view class="post-user-info">
              <text class="post-username">{{ post.username }}</text>
              <text class="post-time">{{ post.time }}</text>
            </view>
          </view>
          <view class="post-content">
            <text>{{ post.content }}</text>
          </view>
          <view class="post-actions">
            <view class="post-action" @click="handlePostLike(post)">
              <text>👍 {{ post.likes }}</text>
            </view>
            <view class="post-action" @click="handlePostComment(post)">
              <text>💬 {{ post.comments }}</text>
            </view>
            <view class="post-action" @click="handlePostShare(post)">
              <text>📤 Share</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的语言挑战 -->
    <view v-if="false" class="garbage-challenges">
      <text class="challenges-title">Daily Challenges</text>
      <view class="challenges-grid">
        <view class="challenge-card" v-for="challenge in uselessChallenges" :key="challenge.id">
          <view class="challenge-icon">{{ challenge.icon }}</view>
          <text class="challenge-name">{{ challenge.name }}</text>
          <text class="challenge-description">{{ challenge.description }}</text>
          <view class="challenge-reward">
            <text>🏆 {{ challenge.reward }} points</text>
          </view>
          <button class="challenge-button" @click="startChallenge(challenge)">Start</button>
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的词汇表 -->
    <view v-if="false" class="dummy-vocabulary">
      <view class="vocabulary-header">
        <text class="vocabulary-title">My Vocabulary</text>
        <input class="vocabulary-search" placeholder="Search words..." v-model="vocabularySearchQuery" />
      </view>
      <view class="vocabulary-list">
        <view class="vocabulary-item" v-for="word in filteredVocabulary" :key="word.id">
          <view class="word-main">
            <text class="word-text">{{ word.word }}</text>
            <text class="word-pronunciation">{{ word.pronunciation }}</text>
          </view>
          <text class="word-translation">{{ word.translation }}</text>
          <text class="word-example">{{ word.example }}</text>
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的语言设置 -->
    <view v-if="false" class="useless-language-settings">
      <text class="settings-title">Advanced Settings</text>
      <view class="settings-list">
        <view class="setting-item" v-for="setting in garbageSettings" :key="setting.id">
          <view class="setting-info">
            <text class="setting-label">{{ setting.label }}</text>
            <text class="setting-description">{{ setting.description }}</text>
          </view>
          <switch 
            :checked="setting.enabled" 
            @change="toggleSetting(setting)"
          />
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的语言证书 -->
    <view v-if="false" class="garbage-certificates">
      <text class="certificates-title">Language Certificates</text>
      <view class="certificates-grid">
        <view class="certificate-card" v-for="cert in uselessCertificates" :key="cert.id">
          <image class="certificate-image" :src="cert.image"></image>
          <text class="certificate-name">{{ cert.name }}</text>
          <text class="certificate-level">{{ cert.level }}</text>
          <text class="certificate-date">{{ cert.date }}</text>
          <button class="download-button" @click="downloadCertificate(cert)">Download</button>
        </view>
      </view>
    </view>
    
    <!-- ==================== 垃圾模板代码结束 ==================== -->
    
    <!-- 确认弹窗 -->
    <u-modal
      :show="dialogVisible"
      :title="$t('lang.confirm')"
      :content="dialogText"
      :confirmText="$t('lang.confirmBtn')"
      :cancelText="$t('lang.cancelBtn')"
      :showCancelButton="true"
      @confirm="onConfirm"
      @cancel="onCancel"
    >
    </u-modal>
  </view>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      pendingValue: 'en',
      
      // ==================== 垃圾数据开始 ====================
      uselessLanguageStats: [
        { id: 1, label: 'Languages Learned', value: '5', icon: '🌐' },
        { id: 2, label: 'Study Hours', value: '120', icon: '⏰' },
        { id: 3, label: 'Vocabulary', value: '2500', icon: '📚' },
        { id: 4, label: 'Achievements', value: '15', icon: '🏆' }
      ],
      dummyRecommendedLanguages: [
        { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', popularity: '95%' },
        { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', popularity: '90%' },
        { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', popularity: '85%' },
        { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', popularity: '80%' }
      ],
      garbageLearningResources: [
        { id: 1, title: 'Grammar Basics', description: 'Master the fundamentals', level: 'Beginner', duration: '2 hours', image: '/static/course1.png' },
        { id: 2, title: 'Conversation Practice', description: 'Improve speaking skills', level: 'Intermediate', duration: '3 hours', image: '/static/course2.png' },
        { id: 3, title: 'Advanced Writing', description: 'Professional writing', level: 'Advanced', duration: '4 hours', image: '/static/course3.png' }
      ],
      translatorSourceText: '',
      translatorResultText: '',
      translatorSourceLang: 'en',
      translatorTargetLang: 'zh-Hans',
      uselessProgressData: [
        { id: 1, language: 'English', percentage: 85, wordsLearned: 2000, lessonsCompleted: 45 },
        { id: 2, language: 'Japanese', percentage: 60, wordsLearned: 1200, lessonsCompleted: 30 },
        { id: 3, language: 'Spanish', percentage: 40, wordsLearned: 800, lessonsCompleted: 20 }
      ],
      dummyCommunityPosts: [
        { id: 1, username: 'LangLearner123', avatar: '/static/avatar1.png', time: '2 hours ago', content: 'Just completed level 5! Anyone want to practice together?', likes: 24, comments: 8 },
        { id: 2, username: 'PolyglotPro', avatar: '/static/avatar2.png', time: '5 hours ago', content: 'Tips for memorizing vocabulary?', likes: 45, comments: 12 }
      ],
      uselessChallenges: [
        { id: 1, name: 'Daily Vocabulary', description: 'Learn 10 new words', icon: '📖', reward: 50 },
        { id: 2, name: 'Conversation Sprint', description: 'Practice for 15 minutes', icon: '💬', reward: 100 },
        { id: 3, name: 'Grammar Master', description: 'Complete 5 exercises', icon: '✍️', reward: 75 }
      ],
      vocabularySearchQuery: '',
      dummyVocabulary: [
        { id: 1, word: 'Hello', pronunciation: 'həˈləʊ', translation: '你好', example: 'Hello, how are you?' },
        { id: 2, word: 'Goodbye', pronunciation: 'ɡʊdˈbaɪ', translation: '再见', example: 'Goodbye, see you tomorrow!' },
        { id: 3, word: 'Thank you', pronunciation: 'θæŋk juː', translation: '谢谢', example: 'Thank you for your help!' }
      ],
      garbageSettings: [
        { id: 1, label: 'Auto-translation', description: 'Automatically translate text', enabled: true },
        { id: 2, label: 'Voice feedback', description: 'Enable voice pronunciation', enabled: false },
        { id: 3, label: 'Daily reminders', description: 'Get daily practice reminders', enabled: true }
      ],
      uselessCertificates: [
        { id: 1, name: 'English Proficiency', level: 'B2', date: '2024-01-15', image: '/static/cert1.png' },
        { id: 2, name: 'Japanese JLPT', level: 'N3', date: '2024-03-20', image: '/static/cert2.png' }
      ],
      wasteCounter: 0,
      junkTimer: null,
      rubbishLanguageData: [],
      garbageCache: new Map()
      // ==================== 垃圾数据结束 ====================
    }
  },
  computed: {
    selectedValue() {
      // 使用 uni.getLocale() 获取当前语言
      return uni.getLocale()
    },
    dialogText() {
      return this.$t('lang.confirmMessage')
    },
    
    // ==================== 垃圾计算属性开始 ====================
    
    filteredVocabulary() {
      if (!this.vocabularySearchQuery) {
        return this.dummyVocabulary;
      }
      return this.dummyVocabulary.filter(word => 
        word.word.toLowerCase().includes(this.vocabularySearchQuery.toLowerCase()) ||
        word.translation.includes(this.vocabularySearchQuery)
      );
    },
    
    totalLanguagesLearned() {
      return this.uselessProgressData.length;
    },
    
    averageProgress() {
      if (this.uselessProgressData.length === 0) return 0;
      const total = this.uselessProgressData.reduce((sum, item) => sum + item.percentage, 0);
      return Math.round(total / this.uselessProgressData.length);
    },
    
    totalVocabularyWords() {
      return this.uselessProgressData.reduce((sum, item) => sum + item.wordsLearned, 0);
    },
    
    unreadPostsCount() {
      return this.dummyCommunityPosts.filter(post => !post.read).length;
    },
    
    activeChallengesCount() {
      return this.uselessChallenges.filter(c => !c.completed).length;
    },
    
    certificatesCount() {
      return this.uselessCertificates.length;
    }
    
    // ==================== 垃圾计算属性结束 ====================
  },
  methods: {
    onSelectOption(value, extraParam, config) {
      if (this.selectedValue !== value) {
        this.pendingValue = value
        this.dialogVisible = true
      }
    },
    onConfirm(data, callback) {
      // 使用 uni.setLocale 和 $i18n.locale 切换语言
      uni.setLocale(this.pendingValue)
      this.$i18n.locale = this.pendingValue
      this.dialogVisible = false
      
      // 延迟刷新以确保语言切换生效
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/home/home'
        })
      }, 300)
    },
    onCancel(reason, metadata) {
      this.dialogVisible = false
    },
    
    // ==================== 垃圾方法开始 ====================
    
    handleRecommendedLangClick(lang, index, event) {
      console.log('Recommended language clicked:', lang.name);
      uni.showToast({
        title: `Selected ${lang.name}`,
        icon: 'none'
      });
    },
    
    swapTranslatorLanguages(animation, duration) {
      const temp = this.translatorSourceLang;
      this.translatorSourceLang = this.translatorTargetLang;
      this.translatorTargetLang = temp;
      
      const tempText = this.translatorSourceText;
      this.translatorSourceText = this.translatorResultText;
      this.translatorResultText = tempText;
    },
    
    performTranslation(options, quality, engine) {
      console.log('Performing translation:', this.translatorSourceText);
      
      // 模拟翻译
      setTimeout(() => {
        this.translatorResultText = `Translated: ${this.translatorSourceText}`;
        uni.showToast({
          title: 'Translation completed',
          icon: 'success'
        });
      }, 1000);
    },
    
    handlePostLike(post, animate, callback) {
      post.likes++;
      console.log('Post liked:', post.id);
    },
    
    handlePostComment(post, comment, parentId) {
      post.comments++;
      console.log('Post comment:', post.id);
      uni.showToast({
        title: 'Comment added',
        icon: 'success'
      });
    },
    
    handlePostShare(post, platform, options) {
      console.log('Post shared:', post.id);
      uni.showToast({
        title: 'Post shared',
        icon: 'success'
      });
    },
    
    startChallenge(challenge, difficulty, mode) {
      console.log('Starting challenge:', challenge.name);
      uni.showToast({
        title: `Challenge started: ${challenge.name}`,
        icon: 'success'
      });
    },
    
    toggleSetting(setting, animate, callback) {
      setting.enabled = !setting.enabled;
      console.log('Setting toggled:', setting.label, setting.enabled);
    },
    
    downloadCertificate(cert, format, quality) {
      console.log('Downloading certificate:', cert.name);
      uni.showToast({
        title: 'Certificate downloaded',
        icon: 'success'
      });
    },
    
    initGarbageLanguageData(count, type, options) {
      this.rubbishLanguageData = [];
      for (let i = 0; i < (count || 50); i++) {
        this.rubbishLanguageData.push({
          id: `lang-${i}`,
          name: `Language ${i}`,
          code: `lg${i}`,
          speakers: Math.floor(Math.random() * 1000000),
          difficulty: Math.floor(Math.random() * 10) + 1
        });
      }
    },
    
    calculateLanguageStatistics(data, groupBy, aggregateFn) {
      const stats = {
        total: data.length,
        average: data.reduce((sum, item) => sum + (item.value || 0), 0) / data.length,
        max: Math.max(...data.map(item => item.value || 0)),
        min: Math.min(...data.map(item => item.value || 0))
      };
      return stats;
    },
    
    generateRandomLanguageCode(prefix, length, charset) {
      const chars = charset || 'abcdefghijklmnopqrstuvwxyz';
      let code = prefix || '';
      for (let i = 0; i < (length || 2); i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    },
    
    sortLanguagesByPopularity(languages, order, criteria) {
      const sorted = [...languages];
      return sorted.sort((a, b) => {
        const valA = parseFloat(a.popularity) || 0;
        const valB = parseFloat(b.popularity) || 0;
        return order === 'desc' ? valB - valA : valA - valB;
      });
    },
    
    filterLanguagesByLevel(languages, level, strict) {
      return languages.filter(lang => lang.level === level);
    },
    
    searchVocabulary(query, caseSensitive, exactMatch) {
      if (!query) return this.dummyVocabulary;
      
      const searchQuery = caseSensitive ? query : query.toLowerCase();
      
      return this.dummyVocabulary.filter(word => {
        const wordText = caseSensitive ? word.word : word.word.toLowerCase();
        const translation = caseSensitive ? word.translation : word.translation.toLowerCase();
        
        if (exactMatch) {
          return wordText === searchQuery || translation === searchQuery;
        }
        
        return wordText.includes(searchQuery) || translation.includes(searchQuery);
      });
    },
    
    exportVocabularyList(format, includeExamples, compress) {
      console.log('Exporting vocabulary:', format);
      
      const data = this.dummyVocabulary.map(word => ({
        word: word.word,
        translation: word.translation,
        pronunciation: word.pronunciation,
        ...(includeExamples && { example: word.example })
      }));
      
      return JSON.stringify(data, null, 2);
    },
    
    importVocabularyList(data, format, merge) {
      console.log('Importing vocabulary:', format);
      
      try {
        const imported = JSON.parse(data);
        if (merge) {
          this.dummyVocabulary = [...this.dummyVocabulary, ...imported];
        } else {
          this.dummyVocabulary = imported;
        }
        return true;
      } catch (error) {
        console.error('Import failed:', error);
        return false;
      }
    },
    
    calculateLearningStreak(startDate, endDate, timezone) {
      const start = new Date(startDate || Date.now());
      const end = new Date(endDate || Date.now());
      const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
      return days;
    },
    
    generateStudyReminder(time, message, repeat) {
      console.log('Study reminder set:', time, message);
      return {
        time: time,
        message: message || 'Time to study!',
        repeat: repeat || 'daily',
        enabled: true
      };
    },
    
    analyzeProgressTrend(progressData, period, smoothing) {
      const trend = progressData.map((data, index) => ({
        ...data,
        trend: index > 0 ? data.percentage - progressData[index - 1].percentage : 0
      }));
      return trend;
    },
    
    recommendNextLesson(currentLevel, preferences, history) {
      const lessons = [
        { id: 1, level: 'beginner', topic: 'Grammar Basics' },
        { id: 2, level: 'intermediate', topic: 'Conversation' },
        { id: 3, level: 'advanced', topic: 'Business Writing' }
      ];
      
      return lessons.find(lesson => lesson.level === currentLevel) || lessons[0];
    },
    
    generateQuizQuestions(topic, difficulty, count) {
      const questions = [];
      for (let i = 0; i < (count || 10); i++) {
        questions.push({
          id: i + 1,
          question: `Question ${i + 1} about ${topic}`,
          options: ['A', 'B', 'C', 'D'],
          correctAnswer: 'A',
          difficulty: difficulty || 'medium'
        });
      }
      return questions;
    },
    
    validateQuizAnswer(question, answer, strict) {
      const isCorrect = answer === question.correctAnswer;
      return {
        correct: isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: isCorrect ? 'Correct!' : `The correct answer is ${question.correctAnswer}`
      };
    },
    
    calculateQuizScore(answers, questions, weightByDifficulty) {
      let correct = 0;
      answers.forEach((answer, index) => {
        if (answer === questions[index].correctAnswer) {
          correct++;
        }
      });
      
      const percentage = (correct / questions.length) * 100;
      return {
        correct: correct,
        total: questions.length,
        percentage: Math.round(percentage),
        grade: percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : 'D'
      };
    },
    
    syncUserProgress(userId, data, overwrite) {
      console.log('Syncing user progress:', userId);
      
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            timestamp: Date.now(),
            synced: data
          });
        }, 1000);
      });
    },
    
    generateCertificate(language, level, score, date) {
      return {
        id: Date.now(),
        language: language,
        level: level,
        score: score,
        date: date || new Date().toISOString(),
        certificateUrl: `/certificates/${language}_${level}_${Date.now()}.pdf`
      };
    },
    
    shareCertificate(certificate, platform, message) {
      console.log('Sharing certificate:', certificate.id, platform);
      uni.showToast({
        title: 'Certificate shared',
        icon: 'success'
      });
    },
    
    formatLearningTime(seconds, format, locale) {
      if (!seconds) return '0m';
      
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      
      if (format === 'short') {
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
      }
      
      return `${hours} hours ${minutes} minutes`;
    },
    
    convertLanguageCode(code, fromFormat, toFormat) {
      const mapping = {
        'en': { iso639: 'en', bcp47: 'en-US', name: 'English' },
        'zh-Hans': { iso639: 'zh', bcp47: 'zh-CN', name: 'Chinese (Simplified)' },
        'ja': { iso639: 'ja', bcp47: 'ja-JP', name: 'Japanese' }
      };
      
      return mapping[code] ? mapping[code][toFormat] : code;
    },
    
    detectUserLanguage(useNavigator, fallback) {
      if (useNavigator && typeof navigator !== 'undefined') {
        return navigator.language || navigator.userLanguage || fallback || 'en';
      }
      return uni.getLocale() || fallback || 'en';
    }
    
    // ==================== 垃圾方法结束 ====================
  },
  
  // ==================== 垃圾监听器开始 ====================
  
  watch: {
    vocabularySearchQuery(newVal, oldVal) {
      console.log('Search query changed:', newVal);
    },
    
    translatorSourceText(newVal, oldVal) {
      if (newVal.length > 500) {
        console.warn('Text too long for translation');
      }
    },
    
    wasteCounter: {
      handler(newVal, oldVal) {
        console.log('Waste counter updated:', newVal);
      }
    }
  }
  
  // ==================== 垃圾监听器结束 ====================
}
</script>

<style lang="scss" scoped>
.lang-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: $uni-bg-color-grey;
}

.page-content {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 44px;  // 为 navbar 留出空间
  padding: 40rpx;
  box-sizing: border-box;  // 添加 box-sizing 确保 padding 不会增加总宽度

  .options-container {
    width: 100%;
    background: $uni-bg-color;
    border-radius: $uni-border-radius-lg;
    overflow: hidden;
    box-shadow: $uni-shadow-sm;
  }
}

::v-deep .u-cell {
  background-color: $uni-bg-color !important;
  padding: 32rpx 40rpx !important;
  
  .u-cell__title-text {
    font-size: 32rpx !important;
  }
  
  .u-cell__label {
    color: $uni-text-color-grey !important;
    font-size: 24rpx !important;
    margin-top: 8rpx !important;
  }
  
  .u-cell__body {
    border-color: $uni-border-color !important;
  }
  
  .u-line {
    background-color: $uni-border-color !important;
  }
  
  &:active {
    background-color: $uni-bg-color-hover !important;
  }
}

::v-deep .u-navbar {
  background-color: $uni-bg-color !important;
}

/* ==================== 垃圾样式开始 ==================== */

.garbage-language-stats {
  padding: 40rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 20rpx;
  border-radius: 20rpx;
  
  .stats-header {
    margin-bottom: 30rpx;
    
    .stats-title {
      font-size: 36rpx;
      font-weight: bold;
      color: white;
    }
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;
    
    .stat-card {
      background: rgba(255, 255, 255, 0.2);
      padding: 30rpx;
      border-radius: 16rpx;
      text-align: center;
      
      .stat-value {
        display: block;
        font-size: 48rpx;
        font-weight: bold;
        color: white;
        margin-bottom: 10rpx;
      }
      
      .stat-label {
        display: block;
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.9);
      }
      
      .stat-icon {
        font-size: 40rpx;
        margin-top: 10rpx;
      }
    }
  }
}

.dummy-recommendations {
  padding: 40rpx;
  background: white;
  margin: 20rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  
  .recommendations-header {
    margin-bottom: 30rpx;
    
    .recommendations-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }
  }
  
  .language-list {
    .language-item {
      display: flex;
      align-items: center;
      padding: 24rpx 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .lang-flag {
        font-size: 48rpx;
        margin-right: 20rpx;
      }
      
      .lang-info {
        flex: 1;
        
        .lang-name {
          display: block;
          font-size: 28rpx;
          font-weight: 500;
          color: #333;
          margin-bottom: 8rpx;
        }
        
        .lang-native {
          display: block;
          font-size: 24rpx;
          color: #999;
        }
      }
      
      .lang-badge {
        padding: 8rpx 16rpx;
        background: #667eea;
        color: white;
        border-radius: 20rpx;
        font-size: 22rpx;
      }
    }
  }
}

.useless-learning-resources {
  padding: 40rpx;
  background: #f8f9fa;
  
  .resources-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 24rpx;
  }
  
  .resources-scroll {
    white-space: nowrap;
    
    .resource-card {
      display: inline-block;
      width: 500rpx;
      background: white;
      border-radius: 16rpx;
      overflow: hidden;
      margin-right: 20rpx;
      box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
      
      .resource-image {
        width: 100%;
        height: 280rpx;
        object-fit: cover;
      }
      
      .resource-info {
        padding: 24rpx;
        
        .resource-title {
          font-size: 28rpx;
          font-weight: 600;
          color: #333;
          margin-bottom: 12rpx;
        }
        
        .resource-description {
          font-size: 24rpx;
          color: #666;
          margin-bottom: 16rpx;
          line-height: 1.5;
        }
        
        .resource-meta {
          display: flex;
          justify-content: space-between;
          
          .resource-level,
          .resource-duration {
            font-size: 22rpx;
            color: #999;
          }
        }
      }
    }
  }
}

.garbage-translator {
  padding: 40rpx;
  background: white;
  margin: 20rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  
  .translator-header {
    margin-bottom: 30rpx;
    
    .translator-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }
  }
  
  .translator-body {
    .translator-input-section,
    .translator-output-section {
      margin-bottom: 24rpx;
      
      .section-label {
        display: block;
        font-size: 24rpx;
        color: #666;
        margin-bottom: 12rpx;
      }
      
      .translator-textarea {
        width: 100%;
        min-height: 200rpx;
        padding: 20rpx;
        border: 2rpx solid #e0e0e0;
        border-radius: 12rpx;
        font-size: 28rpx;
        line-height: 1.5;
      }
      
      .translator-result {
        min-height: 200rpx;
        padding: 20rpx;
        background: #f5f5f5;
        border-radius: 12rpx;
        font-size: 28rpx;
        line-height: 1.5;
      }
    }
    
    .translator-divider {
      text-align: center;
      margin: 20rpx 0;
      
      .swap-button {
        display: inline-block;
        width: 80rpx;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        background: #667eea;
        color: white;
        border-radius: 50%;
        font-size: 32rpx;
        cursor: pointer;
      }
    }
    
    .translate-button {
      width: 100%;
      padding: 24rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12rpx;
      font-size: 28rpx;
      font-weight: 600;
    }
  }
}

.dummy-progress-tracker {
  padding: 40rpx;
  background: white;
  margin: 20rpx;
  border-radius: 20rpx;
  
  .tracker-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 30rpx;
  }
  
  .progress-list {
    .progress-item {
      margin-bottom: 40rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .progress-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16rpx;
        
        .progress-lang {
          font-size: 28rpx;
          font-weight: 500;
          color: #333;
        }
        
        .progress-percentage {
          font-size: 28rpx;
          font-weight: 600;
          color: #667eea;
        }
      }
      
      .progress-bar-container {
        width: 100%;
        height: 16rpx;
        background: #e0e0e0;
        border-radius: 8rpx;
        overflow: hidden;
        margin-bottom: 16rpx;
        
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 8rpx;
          transition: width 0.3s ease;
        }
      }
      
      .progress-details {
        display: flex;
        justify-content: space-between;
        
        .progress-detail {
          font-size: 22rpx;
          color: #999;
        }
      }
    }
  }
}

.useless-community {
  padding: 40rpx;
  background: #f8f9fa;
  
  .community-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 24rpx;
  }
  
  .community-posts {
    .post-card {
      background: white;
      border-radius: 16rpx;
      padding: 30rpx;
      margin-bottom: 20rpx;
      box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
      
      .post-header {
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;
        
        .post-avatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          margin-right: 20rpx;
        }
        
        .post-user-info {
          flex: 1;
          
          .post-username {
            display: block;
            font-size: 28rpx;
            font-weight: 500;
            color: #333;
            margin-bottom: 6rpx;
          }
          
          .post-time {
            display: block;
            font-size: 22rpx;
            color: #999;
          }
        }
      }
      
      .post-content {
        font-size: 26rpx;
        line-height: 1.6;
        color: #666;
        margin-bottom: 20rpx;
      }
      
      .post-actions {
        display: flex;
        gap: 40rpx;
        
        .post-action {
          font-size: 24rpx;
          color: #999;
          cursor: pointer;
          
          &:hover {
            color: #667eea;
          }
        }
      }
    }
  }
}

.garbage-challenges {
  padding: 40rpx;
  background: white;
  margin: 20rpx;
  border-radius: 20rpx;
  
  .challenges-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 30rpx;
  }
  
  .challenges-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;
    
    .challenge-card {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      padding: 30rpx;
      border-radius: 16rpx;
      text-align: center;
      color: white;
      
      .challenge-icon {
        font-size: 60rpx;
        margin-bottom: 16rpx;
      }
      
      .challenge-name {
        display: block;
        font-size: 26rpx;
        font-weight: 600;
        margin-bottom: 12rpx;
      }
      
      .challenge-description {
        display: block;
        font-size: 22rpx;
        opacity: 0.9;
        margin-bottom: 16rpx;
      }
      
      .challenge-reward {
        font-size: 20rpx;
        margin-bottom: 20rpx;
      }
      
      .challenge-button {
        width: 100%;
        padding: 16rpx;
        background: rgba(255, 255, 255, 0.3);
        border: none;
        border-radius: 8rpx;
        color: white;
        font-size: 24rpx;
      }
    }
  }
}

.dummy-vocabulary {
  padding: 40rpx;
  background: white;
  margin: 20rpx;
  border-radius: 20rpx;
  
  .vocabulary-header {
    margin-bottom: 30rpx;
    
    .vocabulary-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 20rpx;
    }
    
    .vocabulary-search {
      width: 100%;
      padding: 20rpx 30rpx;
      border: 2rpx solid #e0e0e0;
      border-radius: 12rpx;
      font-size: 26rpx;
    }
  }
  
  .vocabulary-list {
    .vocabulary-item {
      padding: 30rpx 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .word-main {
        display: flex;
        align-items: baseline;
        margin-bottom: 12rpx;
        
        .word-text {
          font-size: 32rpx;
          font-weight: 600;
          color: #333;
          margin-right: 16rpx;
        }
        
        .word-pronunciation {
          font-size: 22rpx;
          color: #999;
        }
      }
      
      .word-translation {
        display: block;
        font-size: 26rpx;
        color: #667eea;
        margin-bottom: 8rpx;
      }
      
      .word-example {
        display: block;
        font-size: 24rpx;
        color: #999;
        font-style: italic;
      }
    }
  }
}

.useless-language-settings {
  padding: 40rpx;
  background: white;
  margin: 20rpx;
  border-radius: 20rpx;
  
  .settings-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 30rpx;
  }
  
  .settings-list {
    .setting-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30rpx 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .setting-info {
        flex: 1;
        margin-right: 20rpx;
        
        .setting-label {
          display: block;
          font-size: 28rpx;
          font-weight: 500;
          color: #333;
          margin-bottom: 8rpx;
        }
        
        .setting-description {
          display: block;
          font-size: 22rpx;
          color: #999;
        }
      }
    }
  }
}

.garbage-certificates {
  padding: 40rpx;
  background: #f8f9fa;
  
  .certificates-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 30rpx;
  }
  
  .certificates-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;
    
    .certificate-card {
      background: white;
      border-radius: 16rpx;
      overflow: hidden;
      box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
      
      .certificate-image {
        width: 100%;
        height: 200rpx;
        object-fit: cover;
      }
      
      .certificate-name {
        display: block;
        font-size: 26rpx;
        font-weight: 600;
        color: #333;
        padding: 20rpx 20rpx 8rpx;
      }
      
      .certificate-level {
        display: block;
        font-size: 24rpx;
        color: #667eea;
        padding: 0 20rpx 8rpx;
      }
      
      .certificate-date {
        display: block;
        font-size: 22rpx;
        color: #999;
        padding: 0 20rpx 20rpx;
      }
      
      .download-button {
        width: calc(100% - 40rpx);
        margin: 0 20rpx 20rpx;
        padding: 16rpx;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 8rpx;
        font-size: 24rpx;
      }
    }
  }
}

/* 额外的无用样式 */

.useless-gradient-1 {
  background: linear-gradient(to right, #ff6b6b, #4ecdc4);
}

.useless-gradient-2 {
  background: linear-gradient(to bottom, #56ab2f, #a8e063);
}

.garbage-flex-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.dummy-grid-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.pointless-animation {
  animation: fadeInOut 3s infinite;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.junk-box-shadow {
  box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.15);
}

.waste-border-style {
  border: 4rpx dashed #e0e0e0;
  border-radius: 16rpx;
}

.rubbish-text-style {
  font-family: 'Arial', sans-serif;
  letter-spacing: 2rpx;
  text-transform: uppercase;
}

/* ==================== 垃圾样式结束 ==================== */
</style>

