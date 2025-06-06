import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface StepIntroductionProps {
  title: string;
  description: string;
  features: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
  videoSrc: string;
  stepNumber?: number;
}

export function StepIntroduction({ title, description, features, videoSrc, stepNumber }: StepIntroductionProps) {
  return (
    <div className="space-y-8">
      {/* Video Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center"
      >
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="rounded-xl w-full max-w-md mb-4"
          poster="/video/step_poster.png"
        />
      </motion.div>

      {/* Step Number */}
      

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-left"
      >
        {stepNumber && (
        <div className="text-left text-muted-foreground font-semibold text-lg">
          Step {stepNumber}
        </div>
      )}
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{description}</p>
      </motion.div>

      {/* Features as Paragraphs */}
      <div className="space-y-4 max-w-2xl mx-auto">
        {features.map((feature, index) => (
          <div key={feature.title} className="flex items-start gap-3">
            <span className="mt-1">{feature.icon}</span>
            <div>
              <span className="font-semibold">{feature.title}: </span>
              <span className="text-muted-foreground">{feature.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 