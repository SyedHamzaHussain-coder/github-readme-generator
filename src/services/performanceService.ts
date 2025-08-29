import { RepositoryAnalysis } from './repositoryAnalyzer';

export interface PerformanceConfig {
  rateLimiting: RateLimitConfig;
  caching: CacheConfig;
  bulkProcessing: BulkProcessingConfig;
  monitoring: MonitoringConfig;
}

export interface RateLimitConfig {
  enabled: boolean;
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests: boolean;
  skipFailedRequests: boolean;
  keyGenerator?: (req: any) => string;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number;
  maxSize: number;
  strategy: 'lru' | 'fifo' | 'lfu';
  redisUrl?: string;
}

export interface BulkProcessingConfig {
  enabled: boolean;
  batchSize: number;
  maxConcurrency: number;
  delayBetweenBatches: number;
  retryAttempts: number;
  progressCallback?: (progress: BulkProgress) => void;
}

export interface MonitoringConfig {
  enabled: boolean;
  metricsEndpoint: string;
  alertWebhook?: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export interface BulkProgress {
  total: number;
  completed: number;
  failed: number;
  inProgress: number;
  percentage: number;
  estimatedTimeRemaining: number;
  errors: BulkError[];
}

export interface BulkError {
  repositoryUrl: string;
  error: string;
  timestamp: Date;
  retryCount: number;
}

export interface BulkJob {
  id: string;
  repositories: string[];
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: BulkProgress;
  createdAt: Date;
  completedAt?: Date;
  results: BulkResult[];
}

export interface BulkResult {
  repositoryUrl: string;
  status: 'success' | 'failed';
  readme?: string;
  error?: string;
  processingTime: number;
  timestamp: Date;
}

export interface PerformanceMetrics {
  requests: RequestMetrics;
  caching: CacheMetrics;
  processing: ProcessingMetrics;
  errors: ErrorMetrics;
}

export interface RequestMetrics {
  total: number;
  successful: number;
  failed: number;
  averageResponseTime: number;
  requestsPerSecond: number;
  peakRequestsPerSecond: number;
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  evictions: number;
  currentSize: number;
  memoryUsage: number;
}

export interface ProcessingMetrics {
  averageProcessingTime: number;
  slowestProcessingTime: number;
  fastestProcessingTime: number;
  totalProcessingTime: number;
  bulkJobsCompleted: number;
  repositoriesProcessed: number;
}

export interface ErrorMetrics {
  totalErrors: number;
  errorsByType: Record<string, number>;
  rateLimitViolations: number;
  timeoutErrors: number;
  networkErrors: number;
}

export class PerformanceService {
  private static config: PerformanceConfig = {
    rateLimiting: {
      enabled: true,
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100,
      skipSuccessfulRequests: false,
      skipFailedRequests: false
    },
    caching: {
      enabled: true,
      ttl: 24 * 60 * 60 * 1000, // 24 hours
      maxSize: 1000,
      strategy: 'lru'
    },
    bulkProcessing: {
      enabled: true,
      batchSize: 10,
      maxConcurrency: 5,
      delayBetweenBatches: 1000,
      retryAttempts: 3
    },
    monitoring: {
      enabled: true,
      metricsEndpoint: '/api/metrics',
      logLevel: 'info'
    }
  };

  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private static requestCounts = new Map<string, { count: number; resetTime: number }>();
  private static bulkJobs = new Map<string, BulkJob>();
  private static metrics: PerformanceMetrics = this.initializeMetrics();

  // Rate Limiting
  static checkRateLimit(clientId: string): { allowed: boolean; remaining: number; resetTime: number } {
    if (!this.config.rateLimiting.enabled) {
      return { allowed: true, remaining: Infinity, resetTime: 0 };
    }

    const now = Date.now();
    const window = this.config.rateLimiting.windowMs;
    const limit = this.config.rateLimiting.maxRequests;

    const clientData = this.requestCounts.get(clientId);
    
    if (!clientData || now > clientData.resetTime) {
      const resetTime = now + window;
      this.requestCounts.set(clientId, { count: 1, resetTime });
      return { allowed: true, remaining: limit - 1, resetTime };
    }

    if (clientData.count >= limit) {
      return { allowed: false, remaining: 0, resetTime: clientData.resetTime };
    }

    clientData.count++;
    return { 
      allowed: true, 
      remaining: limit - clientData.count, 
      resetTime: clientData.resetTime 
    };
  }

  // Caching
  static getCached<T>(key: string): T | null {
    if (!this.config.caching.enabled) return null;

    const cached = this.cache.get(key);
    if (!cached) {
      this.metrics.caching.misses++;
      return null;
    }

    const now = Date.now();
    if (now > cached.timestamp + cached.ttl) {
      this.cache.delete(key);
      this.metrics.caching.misses++;
      this.metrics.caching.evictions++;
      return null;
    }

    this.metrics.caching.hits++;
    return cached.data as T;
  }

  static setCached<T>(key: string, data: T, customTtl?: number): void {
    if (!this.config.caching.enabled) return;

    const ttl = customTtl || this.config.caching.ttl;
    const timestamp = Date.now();

    // Evict oldest entries if cache is full
    if (this.cache.size >= this.config.caching.maxSize) {
      this.evictOldestEntries();
    }

    this.cache.set(key, { data, timestamp, ttl });
    this.metrics.caching.currentSize = this.cache.size;
  }

  private static evictOldestEntries(): void {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toRemove = Math.ceil(this.config.caching.maxSize * 0.2); // Remove 20%
    for (let i = 0; i < toRemove && entries.length > 0; i++) {
      this.cache.delete(entries[i][0]);
      this.metrics.caching.evictions++;
    }
  }

  // Bulk Processing
  static async createBulkJob(repositories: string[]): Promise<string> {
    const jobId = `bulk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const job: BulkJob = {
      id: jobId,
      repositories,
      status: 'pending',
      progress: {
        total: repositories.length,
        completed: 0,
        failed: 0,
        inProgress: 0,
        percentage: 0,
        estimatedTimeRemaining: 0,
        errors: []
      },
      createdAt: new Date(),
      results: []
    };

    this.bulkJobs.set(jobId, job);
    return jobId;
  }

  static async processBulkJob(jobId: string): Promise<void> {
    const job = this.bulkJobs.get(jobId);
    if (!job) throw new Error(`Job ${jobId} not found`);

    job.status = 'running';
    const startTime = Date.now();

    try {
      await this.processBulkJobInternal(job);
      job.status = 'completed';
      job.completedAt = new Date();
      this.metrics.processing.bulkJobsCompleted++;
    } catch (error) {
      job.status = 'failed';
      job.completedAt = new Date();
      console.error(`Bulk job ${jobId} failed:`, error);
    }

    const totalTime = Date.now() - startTime;
    this.metrics.processing.totalProcessingTime += totalTime;
  }

  private static async processBulkJobInternal(job: BulkJob): Promise<void> {
    const { repositories } = job;
    const { batchSize, maxConcurrency, delayBetweenBatches, retryAttempts } = this.config.bulkProcessing;

    for (let i = 0; i < repositories.length; i += batchSize) {
      const batch = repositories.slice(i, i + batchSize);
      const batchPromises = batch.map(repo => 
        this.processRepositoryWithRetry(repo, retryAttempts, job)
      );

      // Process batch with concurrency limit
      const semaphore = new Semaphore(maxConcurrency);
      await Promise.all(
        batchPromises.map(promise => 
          semaphore.acquire().then(async release => {
            try {
              await promise;
            } finally {
              release();
            }
          })
        )
      );

      // Update progress
      this.updateJobProgress(job);

      // Delay between batches
      if (i + batchSize < repositories.length) {
        await this.delay(delayBetweenBatches);
      }
    }
  }

  private static async processRepositoryWithRetry(
    repositoryUrl: string, 
    maxRetries: number, 
    job: BulkJob
  ): Promise<void> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        job.progress.inProgress++;
        const startTime = Date.now();
        
        // This would integrate with your existing README generation logic
        const readme = await this.generateReadmeForRepository(repositoryUrl);
        
        const processingTime = Date.now() - startTime;
        job.results.push({
          repositoryUrl,
          status: 'success',
          readme,
          processingTime,
          timestamp: new Date()
        });

        job.progress.inProgress--;
        job.progress.completed++;
        this.metrics.processing.repositoriesProcessed++;
        return;

      } catch (error) {
        lastError = error as Error;
        job.progress.inProgress--;
        
        if (attempt < maxRetries) {
          await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
        }
      }
    }

    // All retries failed
    job.progress.failed++;
    job.progress.errors.push({
      repositoryUrl,
      error: lastError?.message || 'Unknown error',
      timestamp: new Date(),
      retryCount: maxRetries
    });

    job.results.push({
      repositoryUrl,
      status: 'failed',
      error: lastError?.message || 'Unknown error',
      processingTime: 0,
      timestamp: new Date()
    });
  }

  private static async generateReadmeForRepository(repositoryUrl: string): Promise<string> {
    // This would integrate with your existing README generation logic
    // For now, return a placeholder
    await this.delay(Math.random() * 2000 + 1000); // Simulate processing time
    return `# Generated README for ${repositoryUrl}`;
  }

  private static updateJobProgress(job: BulkJob): void {
    const { total, completed, failed } = job.progress;
    job.progress.percentage = Math.round(((completed + failed) / total) * 100);
    
    // Estimate time remaining based on completed items
    if (completed > 0) {
      const elapsedTime = Date.now() - job.createdAt.getTime();
      const avgTimePerItem = elapsedTime / completed;
      const remainingItems = total - completed - failed;
      job.progress.estimatedTimeRemaining = Math.round(avgTimePerItem * remainingItems);
    }

    // Call progress callback if provided
    if (this.config.bulkProcessing.progressCallback) {
      this.config.bulkProcessing.progressCallback(job.progress);
    }
  }

  static getBulkJob(jobId: string): BulkJob | undefined {
    return this.bulkJobs.get(jobId);
  }

  static getAllBulkJobs(): BulkJob[] {
    return Array.from(this.bulkJobs.values());
  }

  static cancelBulkJob(jobId: string): boolean {
    const job = this.bulkJobs.get(jobId);
    if (!job || job.status === 'completed' || job.status === 'failed') {
      return false;
    }
    
    job.status = 'cancelled';
    job.completedAt = new Date();
    return true;
  }

  // Monitoring & Metrics
  static getMetrics(): PerformanceMetrics {
    this.updateDynamicMetrics();
    return { ...this.metrics };
  }

  private static updateDynamicMetrics(): void {
    this.metrics.caching.hitRate = this.metrics.caching.hits / 
      (this.metrics.caching.hits + this.metrics.caching.misses) || 0;
    this.metrics.caching.currentSize = this.cache.size;
  }

  static recordRequest(success: boolean, responseTime: number): void {
    this.metrics.requests.total++;
    
    if (success) {
      this.metrics.requests.successful++;
    } else {
      this.metrics.requests.failed++;
      this.metrics.errors.totalErrors++;
    }

    // Update average response time
    const total = this.metrics.requests.total;
    const currentAvg = this.metrics.requests.averageResponseTime;
    this.metrics.requests.averageResponseTime = 
      ((currentAvg * (total - 1)) + responseTime) / total;
  }

  static recordError(errorType: string): void {
    this.metrics.errors.errorsByType[errorType] = 
      (this.metrics.errors.errorsByType[errorType] || 0) + 1;
  }

  // Utility Methods
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static initializeMetrics(): PerformanceMetrics {
    return {
      requests: {
        total: 0,
        successful: 0,
        failed: 0,
        averageResponseTime: 0,
        requestsPerSecond: 0,
        peakRequestsPerSecond: 0
      },
      caching: {
        hits: 0,
        misses: 0,
        hitRate: 0,
        evictions: 0,
        currentSize: 0,
        memoryUsage: 0
      },
      processing: {
        averageProcessingTime: 0,
        slowestProcessingTime: 0,
        fastestProcessingTime: Infinity,
        totalProcessingTime: 0,
        bulkJobsCompleted: 0,
        repositoriesProcessed: 0
      },
      errors: {
        totalErrors: 0,
        errorsByType: {},
        rateLimitViolations: 0,
        timeoutErrors: 0,
        networkErrors: 0
      }
    };
  }

  // Configuration
  static updateConfig(newConfig: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  static getConfig(): PerformanceConfig {
    return { ...this.config };
  }
}

// Semaphore class for concurrency control
class Semaphore {
  private permits: number;
  private queue: (() => void)[] = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<() => void> {
    return new Promise(resolve => {
      if (this.permits > 0) {
        this.permits--;
        resolve(() => this.release());
      } else {
        this.queue.push(() => {
          this.permits--;
          resolve(() => this.release());
        });
      }
    });
  }

  private release(): void {
    this.permits++;
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      if (next) next();
    }
  }
}

export default PerformanceService;
