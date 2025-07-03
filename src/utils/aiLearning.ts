import { MedicalRecord } from '../types';

export interface FeedbackData {
  recordId: string;
  helpful: boolean;
  rating: number;
  comments: string;
  timestamp: Date;
}

export interface LearningMetrics {
  totalFeedback: number;
  averageRating: number;
  helpfulPercentage: number;
  commonIssues: string[];
  improvementSuggestions: string[];
}

export class AILearningEngine {
  private static feedbackStorage = 'ai_feedback_data';
  private static metricsStorage = 'ai_learning_metrics';

  static submitFeedback(feedback: FeedbackData): void {
    const existingFeedback = this.getFeedbackData();
    existingFeedback.push(feedback);
    
    localStorage.setItem(this.feedbackStorage, JSON.stringify(existingFeedback));
    this.updateMetrics();
  }

  static getFeedbackData(): FeedbackData[] {
    const data = localStorage.getItem(this.feedbackStorage);
    return data ? JSON.parse(data) : [];
  }

  static getMetrics(): LearningMetrics {
    const data = localStorage.getItem(this.metricsStorage);
    return data ? JSON.parse(data) : this.calculateMetrics();
  }

  private static updateMetrics(): void {
    const metrics = this.calculateMetrics();
    localStorage.setItem(this.metricsStorage, JSON.stringify(metrics));
  }

  private static calculateMetrics(): LearningMetrics {
    const feedback = this.getFeedbackData();
    
    if (feedback.length === 0) {
      return {
        totalFeedback: 0,
        averageRating: 0,
        helpfulPercentage: 0,
        commonIssues: [],
        improvementSuggestions: []
      };
    }

    const totalFeedback = feedback.length;
    const averageRating = feedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback;
    const helpfulCount = feedback.filter(f => f.helpful).length;
    const helpfulPercentage = (helpfulCount / totalFeedback) * 100;

    // Analyze common issues from negative feedback
    const negativeComments = feedback
      .filter(f => !f.helpful || f.rating < 3)
      .map(f => f.comments)
      .filter(comment => comment && comment.length > 0);

    const commonIssues = this.extractCommonIssues(negativeComments);
    const improvementSuggestions = this.generateImprovementSuggestions(commonIssues, averageRating);

    return {
      totalFeedback,
      averageRating,
      helpfulPercentage,
      commonIssues,
      improvementSuggestions
    };
  }

  private static extractCommonIssues(comments: string[]): string[] {
    const issues: string[] = [];
    const keywords = [
      'inaccurate', 'wrong', 'incorrect', 'medicine', 'diagnosis',
      'symptoms', 'not helpful', 'confusing', 'unclear', 'slow'
    ];

    comments.forEach(comment => {
      const lowerComment = comment.toLowerCase();
      keywords.forEach(keyword => {
        if (lowerComment.includes(keyword)) {
          issues.push(`Issues with ${keyword}`);
        }
      });
    });

    // Return unique issues, sorted by frequency
    const issueCounts = issues.reduce((acc: Record<string, number>, issue) => {
      acc[issue] = (acc[issue] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(issueCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([issue]) => issue);
  }

  private static generateImprovementSuggestions(commonIssues: string[], averageRating: number): string[] {
    const suggestions: string[] = [];

    if (averageRating < 3) {
      suggestions.push('Improve overall diagnostic accuracy');
      suggestions.push('Enhance medicine recommendation algorithm');
    }

    if (commonIssues.some(issue => issue.includes('inaccurate') || issue.includes('wrong'))) {
      suggestions.push('Update disease database with latest medical research');
      suggestions.push('Implement more sophisticated symptom matching');
    }

    if (commonIssues.some(issue => issue.includes('medicine'))) {
      suggestions.push('Expand medicine database with more options');
      suggestions.push('Improve drug interaction checking');
    }

    if (commonIssues.some(issue => issue.includes('confusing'))) {
      suggestions.push('Simplify user interface and explanations');
      suggestions.push('Provide more detailed guidance');
    }

    if (commonIssues.some(issue => issue.includes('slow'))) {
      suggestions.push('Optimize diagnostic processing speed');
      suggestions.push('Improve system performance');
    }

    // Default suggestions if no specific issues found
    if (suggestions.length === 0) {
      suggestions.push('Continue monitoring system performance');
      suggestions.push('Regularly update medical knowledge base');
      suggestions.push('Enhance user experience based on feedback');
    }

    return suggestions.slice(0, 5);
  }

  static analyzePatternTrends(medicalRecords: MedicalRecord[]): {
    symptomTrends: Array<{ symptom: string; frequency: number; trend: 'increasing' | 'decreasing' | 'stable' }>;
    diseaseTrends: Array<{ disease: string; frequency: number; trend: 'increasing' | 'decreasing' | 'stable' }>;
    seasonalPatterns: Record<string, number>;
  } {
    // Group records by month for trend analysis
    const monthlyData = medicalRecords.reduce((acc, record) => {
      const month = new Date(record.date).getMonth();
      if (!acc[month]) acc[month] = [];
      acc[month].push(record);
      return acc;
    }, {} as Record<number, MedicalRecord[]>);

    // Analyze symptom trends
    const symptomCounts = medicalRecords.reduce((acc, record) => {
      record.symptoms.forEach(symptom => {
        acc[symptom] = (acc[symptom] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const symptomTrends = Object.entries(symptomCounts)
      .map(([symptom, frequency]) => ({
        symptom,
        frequency,
        trend: 'stable' as const // Simplified - would need historical data for real trends
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    // Analyze disease trends
    const diseaseCounts = medicalRecords.reduce((acc, record) => {
      acc[record.diagnosis] = (acc[record.diagnosis] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const diseaseTrends = Object.entries(diseaseCounts)
      .map(([disease, frequency]) => ({
        disease,
        frequency,
        trend: 'stable' as const
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    // Seasonal patterns
    const seasonalPatterns = medicalRecords.reduce((acc, record) => {
      const season = this.getSeason(new Date(record.date));
      acc[season] = (acc[season] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      symptomTrends,
      diseaseTrends,
      seasonalPatterns
    };
  }

  private static getSeason(date: Date): string {
    const month = date.getMonth();
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Autumn';
    return 'Winter';
  }

  static generateInsights(medicalRecords: MedicalRecord[]): string[] {
    const insights: string[] = [];
    const feedback = this.getFeedbackData();
    const metrics = this.getMetrics();

    // System performance insights
    if (metrics.averageRating > 4) {
      insights.push('🎉 Excellent user satisfaction! System is performing well.');
    } else if (metrics.averageRating < 3) {
      insights.push('⚠️ Low user satisfaction detected. Review diagnostic accuracy.');
    }

    // Usage pattern insights
    if (medicalRecords.length > 0) {
      const recentRecords = medicalRecords.filter(
        record => new Date(record.date).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
      );
      
      if (recentRecords.length > medicalRecords.length * 0.3) {
        insights.push('📈 High recent activity - system usage is increasing.');
      }

      const commonSymptoms = this.getMostCommonSymptoms(medicalRecords, 3);
      if (commonSymptoms.length > 0) {
        insights.push(`🔍 Most common symptoms: ${commonSymptoms.join(', ')}`);
      }
    }

    // Feedback insights
    if (feedback.length > 0) {
      const recentNegative = feedback.filter(
        f => !f.helpful && new Date(f.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
      );
      
      if (recentNegative.length > 0) {
        insights.push('❗ Recent negative feedback requires attention.');
      }
    }

    return insights.slice(0, 5);
  }

  private static getMostCommonSymptoms(records: MedicalRecord[], count: number): string[] {
    const symptomCounts = records.reduce((acc, record) => {
      record.symptoms.forEach(symptom => {
        acc[symptom] = (acc[symptom] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(symptomCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, count)
      .map(([symptom]) => symptom);
  }
}