
export interface Course {
  id: string;
  title: string;
  software: string;
  description: string;
  imageUrl: string;
  color: string;
  students: string;
  learningPoints: string[];
  workflowImpact: string;
  price: number;
  originalPrice: number;
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  location: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
